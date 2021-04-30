require('dotenv').config();
const { app, BrowserWindow, ipcMain, Menu, MenuItem, dialog } = require('electron');
const { NFC, TAG_ISO_14443_3, KEY_TYPE_A, KEY_TYPE_B } = require('nfc-pcsc');
const crypto = require('crypto');
const path = require('path');
const cron = require('node-cron');
const { Gpio } = require('onoff');

let assist_import = {
	enabled: false,
	year: '',
	only_member_on_even_balance: false,
	remove_non_members: false
};

const env_assist_import_year = process.env?.ASSIST_IMPORT_YEAR;
const env_assist_only_member_on_even_balance = process.env?.ASSIST_ONLY_MEMBER_ON_EVEN_BALANCE;
const env_assist_remove_non_members = process.env?.ASSIST_REMOVE_NON_MEMBERS;

let win;

const debug_enabled = process.env?.DEBUG === '1';
const gate_enabled = process.env?.GATE === '1';
const feed_A = process.env?.FEED_A;
const feed_B = process.env?.FEED_B;
const read_a_write_b_access = '78778800';
const transport_access = 'FF078000';
const transport_key = 'ffffffffffff';

const gpio_pin = {
	sens_in: 23,
	sens_out: 24,
	gate: 14
};

if (typeof feed_A === 'undefined' || !feed_A){
	throw 'No FEED_A set!';
}

if (typeof feed_B === 'undefined' || !feed_B){
	throw 'No FEED_B set!';
}

if (typeof env_assist_import_year !== 'undefined'
	&& env_assist_import_year
	&& env_assist_import_year !== '0'){
	assist_import.enabled = true;
}

if (assist_import.enabled){
	if (!(Number.isInteger(Number(env_assist_import_year)) && (Number(env_assist_import_year) >= 2000))){
		throw 'ASSIST_IMPORT_YEAR not valid';
	}

	assist_import.year = env_assist_import_year;

	if (typeof env_assist_only_member_on_even_balance !== 'undefined'
		&& env_assist_only_member_on_even_balance === '1'){
			assist_import.only_member_on_even_balance = true;
	}

	if (typeof env_assist_remove_non_members !== 'undefined'
		&& env_assist_remove_non_members === '1'){
			assist_import.remove_non_members = true;
	}
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
		height: 768,
		show: false,
		darkTheme: true,
		backgroundColor: '#000000',
		icon: path.join(__dirname, '/../icon/512x512.png'),
    webPreferences: {
      nodeIntegration: true,
			nodeIntegrationInWorker: true,
			enableRemoteModule: true
    }
  });

	if (!gate_enabled){
		win.setMinimumSize(1400, 768);
		win.maximize();
	}

  if (gate_enabled){
		win.setKiosk(true);
  }

  win.loadFile(path.join(__dirname, '../public/index.html'))
  .then(() => {
		console.log('win then');
		listen_pcsc(win);
		listen_gpio(win);
  });

  if (debug_enabled){
		win.webContents.openDevTools({
			'mode': 'bottom'
		});
  }

  win.once('ready-to-show', () => {
		console.log('win event ready-to-show');
		win.show();
  });
};

const remove_nfc_listeners = () => {
	ipcMain.removeAllListeners('nfc.test_a_key');
	ipcMain.removeAllListeners('nfc.test_b_key');
	ipcMain.removeAllListeners('nfc.test_transport_key');
	ipcMain.removeAllListeners('nfc.init');
	ipcMain.removeAllListeners('nfc.read');
	ipcMain.removeAllListeners('nfc.reset');
};

const listen_pcsc = (win) => {
	const pcsc = new NFC();
	let reader_ready = true;

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
			remove_nfc_listeners();

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

			console.log('key_B', key_B);
			console.log('key_A', key_A);

			ipcMain.on('nfc.test_a_key', async (event) => {
				if (!reader_ready){
					console.log('nfc.test_a_key ignored, reader busy ...');
					return;
				}
				reader_ready = false;
				console.log('nfc.test_a_key');
				try {
					await reader.authenticate(6, KEY_TYPE_A, key_A);
					await reader.read(6, 16, 16);
					console.log('nfc.test_a_key.ok', card.uid);
					reader_ready = true;
					event.reply('nfc.test_a_key.ok', card);
				} catch (err) {
					console.log(err);
					console.log('nfc.test_a_key.fail', card.uid);
					reader_ready = true;
					event.reply('nfc.test_a_key.fail', card);
				}
			});

			ipcMain.on('nfc.test_b_key', async (event) => {
				if (!reader_ready){
					console.log('nfc.test_b_key ignored, reader busy ...');
					return;
				}
				reader_ready = false;
				console.log('nfc.test_b_key');
				try {
					await reader.authenticate(6, KEY_TYPE_B, key_B);
					await reader.read(6, 16, 16);
					console.log('nfc.test_b_key.ok', card.uid);
					reader_ready = true;
					event.reply('nfc.test_b_key.ok', card);
				} catch (err) {
					console.log(err);
					console.log('nfc.test_b_key.fail', card.uid);
					reader_ready = true;
					event.reply('nfc.test_b_key.fail', card);
				}
			});

			ipcMain.on('nfc.test_transport_key', async (event) => {
				if (!reader_ready){
					console.log('nfc.test_transport_key ignored, reader busy ...');
					return;
				}
				reader_ready = false;
				console.log('nfc.test_transport_key');
				try {
					await reader.authenticate(6, KEY_TYPE_A, transport_key);
					console.log('nfc.test_transport_key.ok', card.uid);
					reader_ready = true;
					event.reply('nfc.test_transport_key.ok', card);
				} catch (err) {
					console.log(err);
					console.log('nfc.test_transport_key.fail', card.uid);
					reader_ready = true;
					event.reply('nfc.test_transport_key.fail', card);
				}
			});

			ipcMain.on('nfc.init', async (event, person) => {
				if (!reader_ready){
					console.log('nfc.init ignored, reader busy ...');
					return;
				}
				reader_ready = false;
				console.log('nfc.init');
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
					reader_ready = true;
					event.reply('nfc.init.ok', card);
				} catch (err){
					console.log('fail setting new access');
					console.log(err);
					reader_ready = true;
					event.reply('nfc.init.fail', card);
				}
			});

			ipcMain.on('nfc.read', async (event) => {
				if (!reader_ready){
					console.log('nfc.read ignored, reader busy ...');
					return;
				}
				reader_ready = false;
				console.log('nfc.read');
				try {
					await reader.authenticate(6, KEY_TYPE_A, key_A);
					let data = await reader.read(6, 16, 16);
					let str = data.toString();
					let byear = str.substring(0, 4);
					let bmonth = str.substring(4, 6);
					let bdate = str.substring(6, 8);
					let date_of_birth = byear + '.' + bmonth + '.' + bdate;
					let member_id = str.substring(8, 16);
					console.log('nfc.read.ok', card.uid, date_of_birth, member_id);
					reader_ready = true;
					event.reply('nfc.read.ok', card, date_of_birth, member_id);
				} catch (err) {
					console.log(err);
					console.log('nfc.read.fail', card.uid);
					reader_ready = true;
					event.reply('nfc.read.fail', card);
				}
			});

			ipcMain.on('nfc.reset', async (event) => {
				if (!reader_ready){
					console.log('nfc.reset ignored, reader busy ...');
					return;
				}
				reader_ready = false;
				console.log('nfc.reset');
				let reset_access = Buffer.from(transport_key + transport_access + transport_key, 'hex');
				let null_data = Buffer.alloc(16);
				try {
					await reader.authenticate(6, KEY_TYPE_B, key_B);
					await reader.write(6, null_data, 16);
					await reader.write(7, reset_access, 16);
					// try transport_key
					await reader.authenticate(6, KEY_TYPE_A, transport_key);
					console.log('Tag reset to transport keys', card.uid);
					reader_ready = true;
					event.reply('nfc.reset.ok', card);
				} catch (err){
					console.log('fail setting new access');
					console.log(err);
					reader_ready = true;
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
};

const listen_gpio = (win) => {
	console.log('listen_gpio');

	let block_sens_in = false;
	let block_sens_out = false;

	const gpio_sens_in = new Gpio(gpio_pin.sens_in, 'in', 'rising', {
		activeLow: true
	});

	const gpio_sens_out = new Gpio(gpio_pin.sens_out, 'in', 'rising', {
		activeLow: true
	});

	const gpio_gate = new Gpio(gpio_pin.gate, 'high');

	gpio_sens_in.watch((err, value) => {
		if (err){
			console.log('err gpio.sens.in');
			console.log(err);
			return;
		}
		if (block_sens_in){
			console.log('gpio sens in debounced');
			return;
		}
		block_sens_in = true;
		setTimeout(() => {
			block_sens_in = false;
		}, 1000);
		console.log('gpio.sens.in', value);
		win.webContents.send('gpio.sens.in');
	});

	gpio_sens_out.watch((err, value) => {
		if (err){
			console.log('err gpio.sens.out');
			console.log(err);
			return;
		}
		if (block_sens_out){
			console.log('gpio sens out debounced');
			return;
		}
		block_sens_out = true;
		setTimeout(() => {
			block_sens_out = false;
		}, 1000);
		console.log('gpio.sens.out', value);
		win.webContents.send('gpio.sens.out');
	});

	ipcMain.on('gpio.gate.open', (event) => {
		console.log('gpio.gate.open');
		gpio_gate.writeSync(false);
		event.reply('gpio.gate.is_open');
	});

	ipcMain.on('gpio.gate.close', (event) => {
		console.log('gpio.gate.close');
		gpio_gate.writeSync(true);
		event.reply('gpio.gate.is_closed');
	});

	ipcMain.handle('gpio.gate.sync', async (event) => {
		return await !gpio_gate.readSync();
	});

	process.on('SIGINT', () => {
		gpio_sens_in.unexport();
		gpio_sens_out.unexport();
		gpio_gate.unexport();
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

const import_assist_xlsx = () => {
	if (!assist_import.enabled){
		return;
	}
	const files = dialog.showOpenDialogSync(win, {
		properties: ['openFile'],
        filters: {name: 'MS Excell', extensions: ['xls', 'xlsx']},
        message: 'Import xlsx leden uit Assist, LIDJAAR ' + assist_import.year
	});
	if (!files){
			return;
	}
	win.webContents.send('xls.assist.import', files[0], assist_import);
};

const menu = new Menu();

if(assist_import.enabled){
	const importMenu = new Menu();
	importMenu.append(new MenuItem({ label: 'leden Assist Xlsx', click: import_assist_xlsx }));
	menu.append(new MenuItem({ label: 'Import', submenu: importMenu }));
}

const exportMenu = new Menu();
exportMenu.append(new MenuItem({ label: 'Registraties CSV (covid-19 tracing)', click: () => { win.webContents.send('reg.csv.export'); }}));
exportMenu.append(new MenuItem({ label: 'Database JSON', click: () => { win.webContents.send('db.json.export'); }}));

menu.append(new MenuItem({ label: 'Export', submenu: exportMenu }));
menu.append(new MenuItem({ label: 'Instellingen', click: () => console.log('meuh')} ));
menu.append(new MenuItem({role: 'viewMenu'}));
menu.append(new MenuItem({role: 'windowMenu'}));

Menu.setApplicationMenu(menu);

cron.schedule('0 * * * *', () => {
	console.log('running a task every hour');
});
