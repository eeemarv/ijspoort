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

			// get keys
			let key_B = crypto.createHash('sha256').update(feed_B + card.uid.toLowerCase()).digest('hex').substr(0, 12);
			let key_A = crypto.createHash('sha256').update(feed_A + card.uid.toLowerCase()).digest('hex').substr(0, 12);

			console.log('feed', feed_B, 'key_B', key_B);
			console.log('feed', feed_A, 'key_A', key_A);

			ipcMain.on('nfc.test_a_key', async (event) => {
				try {
					await reader.authenticate(6, KEY_TYPE_A, key_A);
					await reader.read(6, 16, 16);
					console.log('nfc.test_a_key.ok', card.uid);
					event.reply('nfc.test_a_key.ok', card);
				} catch (err) {
					console.log(err);
					console.log('nfc.test_a_key.fail', card.uid);
					event.reply('nfc.test_a_key.fail', card);
				}
			});

			ipcMain.on('nfc.test_b_key', async (event) => {
				const write_test = Buffer.alloc(6);
				try {
					await reader.authenticate(6, KEY_TYPE_B, key_B);
					await reader.write(6, write_test, 16);
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

			ipcMain.on('nfc.init', async (event, person) => {
				let member_id = person._id.substring(1).padStart(8, '0');
				let db = person.date_of_birth.split('/');
				let date_of_birth = (db[2] + db[1] + db[0]).padStart(8, '0');
				let str = date_of_birth + member_id;
				// key A can read everything, key B can write and read everything
				let new_access = Buffer.from(key_A + '78778800' + key_B, 'hex');
				const data = Buffer.alloc(16);
				data.write(str, 'utf-8');
				try {
					await reader.authenticate(6, KEY_TYPE_A, 'ffffffffffff');
					await reader.write(6, data, 16);
					await reader.write(7, new_access, 16);
					// try key B
					await reader.authenticate(6, KEY_TYPE_B, key_B);
					console.log('key B set for writing');
					// try key A
					await reader.authenticate(6, KEY_TYPE_A, key_A);
					console.log('key A set for writing');
					event.reply('nfc.init.ok', card);
				} catch (err){
					console.log('fail setting new access');
					console.log(err);
					event.reply('nfc.init.fail', card);
				}
			});

			ipcMain.on('nfc.read.access_period', async (event) => {
				try {
					await reader.authenticate(44, KEY_TYPE_B, key_B);
					const data = await reader.read(44, 16, 16);
					const str = data.toString();
					console.log('nfc.read.access_period.ok', str);
					event.reply('nfc.read.access_period.ok', card, str);
				} catch (err) {
					console.log(err);
					event.reply('nfc.read.access_period.fail', card);
				}
			});

			ipcMain.on('nfc.write.access_period', async (event, access_period_str) => {
				const data = Buffer.alloc(16);
				data.write(access_period_str, 'utf-8');
				try {
					await reader.authenticate(44, KEY_TYPE_B, key_B);
					await reader.write(44, data, 16);
					console.log('nfc.write.access_period.ok', access_period_str);
					event.reply('nfc.write.access_period.ok', card);
				} catch (err) {
					console.log(err);
					event.reply('nfc.write.access_period.fail', card);
				}
			});

			ipcMain.on('nfc.read.member_id', async (event) => {
				try {
					await reader.authenticate(6, KEY_TYPE_B, key_B);
					const data = await reader.read(6, 16, 16);
					const str = data.toString();
					console.log('nfc.read.member_id.ok', str);
					event.reply('nfc.read.member_id.ok', card, str);
				} catch (err) {
					console.log(err);
					event.reply('nfc.read.member_id.fail', card);
				}
			});

			ipcMain.on('nfc.write.member_id', async (event, str) => {
				const data = Buffer.alloc(16);
				data.write(str, 'utf-8');
				try {
					await reader.authenticate(45, KEY_TYPE_B, key_B);
					await reader.write(45, data, 16);
					console.log('nfc.write.member_id.ok', str);
					event.reply('nfc.write.member_id.ok', card);
				} catch (err) {
					console.log(err);
					event.reply('nfc.write.member_id.fail', card);
				}
			});

			ipcMain.on('nfc.read.firstname', async (event) => {
				try {
					await reader.authenticate(48, KEY_TYPE_B, key_B);
					const data_block_48 = await reader.read(48, 48, 16);
					await reader.authenticate(52, KEY_TYPE_B, key_B);
					const data_block_52 = await reader.read(52, 48, 16);
					const data = Buffer.concat([data_block_48, data_block_52]);
					const null_index = data.indexOf(0x00);
					const firstname = data.slice(0, null_index);
					console.log('nfc.read.firstname.ok', firstname);
					event.reply('nfc.read.firstname.ok', card, firstname);
				} catch (err) {
					console.log(err);
					event.reply('nfc.read.firstname.fail', card);
				}
			});

			ipcMain.on('nfc.write.firstname', async (event, firstname_str) => {
				const data = Buffer.alloc(96);
				data.write(firstname_str, 'utf-8');
				const data_block_48 = Buffer.alloc(48);
				data.copy(data_block_48, 0, 0, 48);
				const data_block_52 = Buffer.alloc(48);
				data.copy(data_block_52, 0, 48, 96);
				try {
					await reader.authenticate(48, KEY_TYPE_B, key_B);
					await reader.write(48, data_block_48, 16);
					await reader.authenticate(52, KEY_TYPE_B, key_B);
					await reader.write(52, data_block_52, 16);
					console.log('nfc.write.firstname.ok', firstname_str);
					event.reply('nfc.write.firstname.ok', card);
				} catch (err) {
					console.log(err);
					event.reply('nfc.write.firstname.fail', card);
				}
			});

			ipcMain.on('nfc.read.surname', async (event) => {
				try {
					await reader.authenticate(48, KEY_TYPE_B, key_B);
					const data_block_56 = await reader.read(56, 48, 16);
					await reader.authenticate(52, KEY_TYPE_B, key_B);
					const data_block_60 = await reader.read(60, 48, 16);
					const data = Buffer.concat([data_block_56, data_block_60]);
					const null_index = data.indexOf(0x00);
					const surname = data.slice(0, null_index);
					console.log('nfc.read.surname.ok', surname);
					event.reply('nfc.read.surname.ok', card, surname);
				} catch (err) {
					console.log(err);
					event.reply('nfc.read.surname.fail', card);
				}
			});

			ipcMain.on('nfc.write.surname', async (event, surname_str) => {
				const data = Buffer.alloc(96);
				data.write(surname_str, 'utf-8');
				const data_block_56 = Buffer.alloc(48);
				data.copy(data_block_56, 0, 0, 48);
				const data_block_60 = Buffer.alloc(48);
				data.copy(data_block_60, 0, 48, 96);
				try {
					await reader.authenticate(56, KEY_TYPE_B, key_B);
					await reader.write(56, data_block_56, 16);
					await reader.authenticate(60, KEY_TYPE_B, key_B);
					await reader.write(60, data_block_60, 16);
					console.log('nfc.write.surname.ok', surname_str);
					event.reply('nfc.write.surname.ok', card);
				} catch (err) {
					console.log(err);
					event.reply('nfc.write.surname.fail', card);
				}
			});
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
exportMenu.append(new MenuItem({ label: 'Registraties CSV (covid-19 tracing)', click: () => { win.webContents.send('reg.csv.export'); }}));
// exportMenu.append(new MenuItem({ label: 'NFC CSV', click: () => { win.webContents.send('nfc.csv.export'); }}));
exportMenu.append(new MenuItem({ label: 'Database JSON', click: () => { win.webContents.send('db.json.export'); }}));

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