require('dotenv').config();
const { app, BrowserWindow, ipcMain, Menu, MenuItem, dialog } = require('electron');
const { NFC, TAG_ISO_14443_3, KEY_TYPE_A, KEY_TYPE_B } = require('nfc-pcsc');
const crypto = require('crypto');
const EidReader = require('./services/eid_reader');
const path = require('path');
const cron = require('node-cron');

let win;
const feed_A = process.env?.FEED_A;
const feed_B = process.env?.FEED_B;

if (typeof feed_A === 'undefined' || !feed_A){
	throw 'No FEED_A set!';
}
if (typeof feed_B === 'undefined' || !feed_B){
	throw 'No FEED_B set!';
}

// Live Reload
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  win = new BrowserWindow({
    width: 1400,
	height: 800,
	show: false,
	darkTheme: true,
	backgroundColor: '#000000',
    webPreferences: {
	  /*
	  worldSafeExecuteJavaScript: true,
	  contextIsolation: true,
	  */
      nodeIntegration: true,
	  nodeIntegrationInWorker: true,
	  enableRemoteModule: true
    }
  });

  win.setMinimumSize(1400, 768);

  win.loadFile(path.join(__dirname, '../public/index.html'))
  .then(() => {
	console.log('win then');
	listenPcsc(win);
  });

  win.webContents.openDevTools({
    'mode': 'bottom'
  });

  win.once('ready-to-show', () => {
	console.log('win event ready-to-show');
	win.show();
  });

  //return win;
};

const remove_nfc_listeners = () => {
	ipcMain.removeAllListeners('nfc.test_a_key');
	ipcMain.removeAllListeners('nfc.test_b_key');
	ipcMain.removeAllListeners('nfc.test_transport_key');
	ipcMain.removeAllListeners('nfc.init');
	ipcMain.removeAllListeners('nfc.write.null');
	ipcMain.removeAllListeners('nfc.write.access_period');
	ipcMain.removeAllListeners('nfc.write.access_end_date');
	ipcMain.removeAllListeners('nfc.write.birthday_and_member_id');
	ipcMain.removeAllListeners('nfc.write.firstname');
	ipcMain.removeAllListeners('nfc.write.surname');
};

const listenPcsc = (win) => {
	const pcsc = new NFC();
	const eid_reader = new EidReader();

	pcsc.on('error', err => {
		win.webContents.send('device.error', err);
	});

	pcsc.on('reader', reader => {
		if (reader.name.toLowerCase().indexOf('acr122') === -1) {
			return;
		}

		console.log('dev.nfc.on', reader.reader.name);
		win.webContents.send('dev.nfc.on');

		reader.on('card', async card => {
			if (card.type !== TAG_ISO_14443_3){
				console.log('It\'s not a ISO 14443-3 tag');
				return;
			}

			if (typeof card.uid === 'undefined'){
				console.log('UID is undefined');
				return;
			}

			console.log(reader.reader.name, 'nfc.on', card);
			win.webContents.send('nfc.on', card);

			remove_nfc_listeners();

			// get keys
			let key_B = crypto.createHash('sha256').update(feed_B + card.uid.toLowerCase()).digest('hex').substr(0, 12);
			let key_A = crypto.createHash('sha256').update(feed_A + card.uid.toLowerCase()).digest('hex').substr(0, 12);

			console.log('feed', feed_B, 'key_B', key_B);
			console.log('feed', feed_A, 'key_A', key_A);

			ipcMain.on('nfc.test_a_key', async (event) => {
				try {
					await reader.authenticate(3, KEY_TYPE_A, key_A);
					console.log('nfc.test_a_key.ok', card.uid);
					event.reply('nfc.test_a_key.ok', card);
				} catch (err) {
					console.log(err);
					console.log('nfc.test_a_key.fail', card.uid);
					event.reply('nfc.test_a_key.fail', card);
				}
			});

			ipcMain.on('nfc.test_b_key', async (event) => {
				try {
					await reader.authenticate(3, KEY_TYPE_B, key_B);
					console.log('nfc.test_b_key.ok', card.uid);
					event.reply('nfc.test_b_key.ok', card);
				} catch (err) {
					console.log(err);
					console.log('nfc.test_b_key.fail', card.uid);
					event.reply('nfc.test_b_key.fail', card);
				}
			});

			ipcMain.on('nfc.test_transport_key', async (event) => {
				try {
					await reader.authenticate(6, KEY_TYPE_A, 'ffffffffffff');
					console.log('nfc.test_transport_key.ok', card.uid);
					event.reply('nfc.test_transport_key.ok', card);
				} catch (err) {
					console.log(err);
					console.log('nfc.test_transport_key.fail', card.uid);
					event.reply('nfc.test_transport_key.fail', card);
				}
			});

			ipcMain.on('nfc.init', async (event) => {
				// key A can read everything, key B can write and read everything
				let new_access = Buffer.from(key_A + '7f00f800' + key_B, 'hex');
				try {
					for (let block = 3; block < 64; block = block + 4){
						if (block > 7 && block < 32){
							// keep blocks 8 - 31 open
							continue;
						}
						await reader.authenticate(block, KEY_TYPE_A, 'ffffffffffff');
						await reader.write(block, new_access, 16);
					}
					// try key B
					await reader.authenticate(3, KEY_TYPE_B, key_B);
					console.log('key B set for writing');
					event.reply('nfc.init.ok', card);
				} catch (err){
					console.log('fail setting new access');
					console.log(err);
					event.reply('nfc.init.fail', card);
				}
			});

			const read_name = () => {

			};

			const write_name = () => {

			};

			const read_to_utf8 = (block) => {

			};

			const write_from_utf8 = (block) => {

			};

			ipcMain.on('nfc.write.access_period', async (event, period_str) => {
				try {
					await reader.authenticate(44, KEY_TYPE_B, key_B);
					await reader.write(44, period_str, 16);
					event.reply('nfc.write.access_period.ok', card);
				} catch (err) {
					console.log(err);
					event.reply('nfc.write.access_period.fail', card);
				}
			});

			ipcMain.on('nfc.write.access_end_date', async (event, date_str) => {
				try {
					await reader.authenticate(44, KEY_TYPE_B, key_B);
					let period = await reader.read(44, period_str, 16);
					await reader.write(44, period_str, 16);
					event.reply('nfc.write.access_end_date.ok', card);
				} catch (err) {
					console.log(err);
					event.reply('nfc.write.access_end_date.fail', card);
				}
			});

			ipcMain.on('nfc.write.birthday_and_member_id', async (str) => {

			});

			ipcMain.on('nfc.write.null', async (event) => {

			});

			ipcMain.on('nfc.write.firstname', async (str) => {

			});

			ipcMain.on('nfc.write.surname', async (str) => {

			});





			/*
			const secret_feed_B = 'dag_beeRtje,hier_is_een_bandje_voor_jou'; // voorbeeld secret feed B
			let key_B = crypto.createHash('sha256').update(secret_feed_B + card.uid.toLowerCase()).digest('hex').substr(0, 12);

			let write_new = false;

			try {
				await reader.authenticate(3, KEY_TYPE_A, key_A);
				console.log('Yeah key A is valid');
			} catch (err) {
				console.log('key A not valid, write new');
				write_new = true;
			}

			try {
				await reader.authenticate(3, KEY_TYPE_B, key_B);
				console.log('Yeah key B is valid');
			} catch (err) {
				console.log('key B not valid');
			}
*/
/*
			if (write_new){
				try {
					await reader.authenticate(3, KEY_TYPE_A, 'ffffffffffff');

					let new_auth = Buffer.from(key_A + '7f00f800' + key_B, 'hex');
					console.log(new_auth.toString('hex'));

					await reader.write(3, new_auth, 16);
					await reader.authenticate(3, KEY_TYPE_B, key_B);

					console.log('key B set for autth!');

				} catch (err) {
					console.log('authentication transport key fail.', err);
				}
			}
*/




			/*
			const key = 'ffffffffffff'; // key must be a 12-chars HEX string, an instance of Buffer, or array of bytes
			const keyType = KEY_TYPE_A;

			try {

				// we want to authenticate sector 1
				// authenticating one block within the sector will authenticate all blocks within that sector
				// so in our case, we choose block 4 that is within the sector 1, all blocks (4, 5, 6, 7)
				// will be authenticated with the given key
				await reader.authenticate(4, keyType, key);

				// Note: writing might require to authenticate with a different key (based on the sector access conditions)

				console.log(`sector 1 successfully authenticated`, reader);

			} catch (err) {
				console.log(`error when authenticating block 4 within the sector 1`, reader, err);
				return;
			}


		// example reading 16 bytes (one block) assuming containing 32bit integer
		// !!! note that we don't need 16 bytes - 32bit integer takes only 4 bytes !!!
		try {

			// reader.read(blockNumber, length, blockSize = 4, packetSize = 16)
			// - blockNumber - memory block number where to start reading
			// - length - how many bytes to read
			// - blockSize - 4 for MIFARE Ultralight, 16 for MIFARE Classic
			// ! Caution! length must be divisible by blockSize
			// ! Caution! MIFARE Classic cards have sector trailers
			//   containing access bits instead of data, each last block in sector is sector trailer
			//   (e.g. block 3, 7, 11, 14)
			//   see memory structure above or https://github.com/pokusew/nfc-pcsc/issues/16#issuecomment-304989178

			const data = await reader.read(4, 64, 16); // blockSize=16 must specified for MIFARE Classic cards

			console.log(`data read`, data);

			const payload = data.toString('hex');

			console.log(`data converted`, payload);

		} catch (err) {
			console.log(`error when reading data`, reader, err);
		}

		*/

		});

		reader.on('card.off', card => {
			remove_nfc_listeners();
			console.log(reader.reader.name, 'nfc.off', card);
			win.webContents.send('nfc.off');
		});

		reader.on('error', err => {
			console.log(reader.reader.name, 'dev.nfc.error', err);
			win.webContents.send('dev.nfc.error', err);
		});

		reader.on('end', () => {
			console.log(reader.reader.name, 'dev.nfc.off');
			win.webContents.send('dev.nfc.off');
		});
	});

	pcsc.on('reader', reader => {
		if (reader.name.toLowerCase().indexOf('acr122') !== -1) {
			return;
		}

		console.log(reader.reader.name, 'dev.eid.on');
		reader.autoProcessing = false;
		win.webContents.send('dev.eid.on');

		reader.on('card', card => {
			win.webContents.send('eid.wait');

			let eid_slot = eid_reader.get_slot();

			if (typeof eid_slot === 'undefined'){
				console.log(reader.reader.name, 'eid.undefined', card);
				win.webContents.send('eid.undefined');
				return;
			}
			let eid = eid_reader.read(eid_slot);
			if (typeof eid === 'undefined'){
				console.log(reader.reader.name, 'eid.undefined', card);
				win.webContents.send('eid.undefined');
				return;
			}

			console.log('eid.on', eid);
			win.webContents.send('eid.on', eid);
		});

		reader.on('card.off', card => {
			console.log(reader.reader.name, 'eid.of');
			win.webContents.send('eid.off');
		});

		reader.on('error', err => {
			console.log(reader.reader.name, 'dev.eid.error', err);
			win.webContents.send('dev.eid.error', err);
		});

		reader.on('end', () => {
			console.log(reader.reader.name, 'dev.eid.off');
			win.webContents.send('dev.eid.off');
		});
	});
};

app.on('ready', () => {
	createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  console.log('all windows closed');
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const importAssistXlsx = () => {
	const files = dialog.showOpenDialogSync(win, {
		properties: ['openFile'],
        filters: {name: 'MS Excell', extensions: ['xls', 'xlsx']},
        message: 'Import xlsx leden vanuit Assist'
	});
    if (!files){
        return;
    }
	win.webContents.send('xls.assist.import', files[0]);
};

const importMenu = new Menu();
importMenu.append(new MenuItem({ label: 'leden Assist Xlsx', click: importAssistXlsx }));

const exportMenu = new Menu();
exportMenu.append(new MenuItem({ label: 'Registraties csv', click: () => { win.webContents.send('csv.reg.export'); }}));

const menu = new Menu();
menu.append(new MenuItem({ label: 'Import', submenu: importMenu }));
menu.append(new MenuItem({ label: 'Export', submenu: exportMenu }));
menu.append(new MenuItem({ label: 'Instellingen', click: () => console.log('meuh')} ));
menu.append(new MenuItem({role: 'viewMenu'}));
menu.append(new MenuItem({role: 'windowMenu'}));

Menu.setApplicationMenu(menu);

cron.schedule('0 * * * *', () => {
	console.log('running a task every hour');
});