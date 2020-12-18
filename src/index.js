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
const read_a_write_b_access = '78778800';
const transport_access = 'FF078000';
const transport_key = 'ffffffffffff';

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
					await reader.authenticate(6, KEY_TYPE_A, transport_key);
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
				let new_access = Buffer.from(key_A + read_a_write_b_access + key_B, 'hex');
				const data = Buffer.alloc(16);
				data.write(str, 'utf-8');
				try {
					await reader.authenticate(6, KEY_TYPE_A, transport_key);
					await reader.write(6, data, 16);
					await reader.write(7, new_access, 16);
					// try key B
					await reader.authenticate(6, KEY_TYPE_B, key_B);
					console.log('key B set for writing', card.uid);
					// try key A
					await reader.authenticate(6, KEY_TYPE_A, key_A);
					console.log('key A set for reading', card.uid);
					console.log('nfc.init.ok', card.uid);
					event.reply('nfc.init.ok', card);
				} catch (err){
					console.log('fail setting new access');
					console.log(err);
					event.reply('nfc.init.fail', card);
				}
			});

			ipcMain.on('nfc.read', async (event) => {
				try {
					await reader.authenticate(6, KEY_TYPE_A, key_A);
					let data = await reader.read(6, 16, 16);
					let str = data.toString();
					let byear = str.substring(0, 4);
					let bmonth = str.substring(4, 6);
					let bdate = str.substring(6, 8);
					let date_of_birth = bdate + '/' + bmonth + '/' + byear;
					let member_id = str.substring(8, 16);
					console.log('nfc.read.ok', card.uid, date_of_birth, member_id);
					event.reply('nfc.read.ok', card, date_of_birth, member_id);
				} catch (err) {
					console.log(err);
					console.log('nfc.read.fail', card.uid);
					event.reply('nfc.read.fail', card);
				}
			});

			ipcMain.on('nfc.reset', async (event) => {
				let reset_access = Buffer.from(transport_key + transport_access + transport_key);
				let null_data = Buffer.alloc(16);
				try {
					await reader.authenticate(6, KEY_TYPE_B, key_B);
					await reader.write(6, null_data, 16);
					await reader.write(7, reset_access, 16);
					// try transport_key
					await reader.authenticate(6, KEY_TYPE_A, transport_key);
					console.log('Tag reset to transport keys', card.uid);
					event.reply('nfc.reset.ok', card);
				} catch (err){
					console.log('fail setting new access');
					console.log(err);
					event.reply('nfc.reset.fail', card);
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