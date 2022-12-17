require('dotenv').config();
const { app, BrowserWindow, ipcMain, Menu, MenuItem, dialog } = require('electron');
const EStore = require('electron-store');
const { NFC, TAG_ISO_14443_3, KEY_TYPE_A, KEY_TYPE_B } = require('nfc-pcsc');
const crypto = require('crypto');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');
const flatten = require('flat');
const { Gpio } = require('onoff');
const ping = require('ping');
const needle = require('needle');
const MFRC522 = require('mfrc522-rpi');
const SoftSPI = require("rpi-softspi");
const rpio = require('rpio');
const mqtt = require('mqtt');
const buzzer_pin = 18;

const eStore = new EStore();
let win;
let mqtt_client;

const env = process.env;
const env_temp_sensor_ip = env.TEMP_SENSOR_IP;
const env_owm_apikey = env.OWM_APIKEY;
const env_owm_location = env.OWM_LOCATION;
const env_thingspeak_apikey = env.THINGSPEAK_APIKEY;
const env_db_sensor_prefix = env.DB_SENSOR_PREFIX;
const env_db_local_prefix = env.DB_LOCAL_PREFIX;
const env_temp_display_ips = env.TEMP_DISPLAY_IPS;
const env_temp_sensor_cron_interval = env.TEMP_SENSOR_CRON_INTERVAL;
const env_temp_display_test = env.TEMP_DISPLAY_TEST && env.TEMP_DISPLAY_TEST === '1';
const env_mqtt_host = env.MQTT_HOST;

const debug_enabled = env?.DEBUG === '1';
const gate_enabled = env?.GATE === '1';
const feed_A = env?.FEED_A;
const feed_B = env?.FEED_B;
const read_a_write_b_access = '78778800';
const transport_access = 'FF078000';
const transport_key = 'ffffffffffff';

const gpio_pin = {
	sens_in: 23,
	sens_out: 24,
	gate: 14
};

const mqtt_client_type = gate_enabled ? 'scan' : 'terminal';
const mqtt_client_id = mqtt_client_type + '_' + Math.random().toString(16).slice(3);

console.log()

if (typeof feed_A !== 'string' || !feed_A){
	throw 'No FEED_A set!';
}

if (typeof feed_B !== 'string' || !feed_B){
	throw 'No FEED_B set!';
}

// https://stackoverflow.com/questions/68874940/gpu-process-isnt-usable-goodbye
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('no-sandbox');

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
		win.setMinimumSize(1366, 768);
		win.maximize();
	}

  if (gate_enabled && !debug_enabled){
		win.setKiosk(true);
  }

  win.loadFile(path.join(__dirname, '../public/index.html'))
  .then(() => {
		console.log('win then');
		listen_pcsc(win);
		if (gate_enabled){
			try {
				listen_mfrc(win);
				mqtt_gate(win);
			} catch (err) {
				console.log(err);
			}
		} else {
			try {
				mqtt_terminal();
			} catch (err) {
				console.log(err);
			}
		}
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

			if (typeof card.uid !== 'string'){
				console.log('UID not set');
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

const listen_mfrc = (win) => {
	const softSPI = new SoftSPI({
		clock: 23, // pin number of SCLK
		mosi: 19, // pin number of MOSI
		miso: 21, // pin number of MISO
		client: 24 // pin number of CS
	});

	const MFRC522_CMD = {
		TRANSCEIVE: 0x0c,
		ANTICOL1: 0x93,
		SELECT1: 0x93,
		ANTICOL2: 0x95,
		SELECT2: 0x95,
		ANTICOL3: 0x97,
		BitFramingReg: 0x0d
	}

	rpio.open(buzzer_pin, rpio.OUTPUT);
	rpio.write(buzzer_pin, rpio.HIGH);

	const mfrc522 = new MFRC522(softSPI).setResetPin(22);

	console.log('MFRC522 send event dev.nfc.on');
	win.webContents.send('dev.nfc.on');

	let res_uid = '';
	let no_find_countdown = 0;

	setInterval(function() {
		if (no_find_countdown){
			no_find_countdown--;
		}
		mfrc522.reset();

		let resp0 = mfrc522.findCard();

		if (!resp0.status){
			if (res_uid !== '' && !no_find_countdown){
				console.log('MFRC522 send event nfc.off');
				win.webContents.send('nfc.off');
				res_uid = '';
			}
			return;
		}

		console.log("Card detected:");
		console.log(resp0);

		//
		let tmp_uid = res_uid;
		mfrc522.writeRegister(MFRC522_CMD.BitFramingReg, 0x00);
		const uid1 = [MFRC522_CMD.ANTICOL1, 0x20];
		res_uid = '';
		let resp1 = mfrc522.toCard(MFRC522_CMD.TRANSCEIVE, uid1);
		if (resp1.status) {
			if (typeof resp1.data === "undefined"){
				console.log('MFRC522 error read cycle 1 prop data is undefined');
				return;
			}
			let uidCheck = 0;
			for (let i = 0; i < 4; i++) {
				if (typeof resp1.data[i] === "undefined"){
					console.log('MFRC522 error read cycle 1 data ' + i + ' is undefined');
					return;
				}
				uidCheck = uidCheck ^ resp1.data[i];
				res_uid += resp1.data[i].toString(16).padStart(2, '0');
			}
			if (uidCheck != resp1.data[4]) {
				console.log('MFRC522 error BCC1 read UID');
				return;
			}
		} else {
			console.log('MFRC522 error resp1 STATUS read UID');
			return;
		}

		// select ACK1
		// replaces mfrc522.selectCard(resp1.data);
		let buff1 = [MFRC522_CMD.SELECT1, 0x70];
		for (let i = 0; i < 5; i++) {
			buff1.push(resp1.data[i]);
		}
		buff1 = buff1.concat(mfrc522.calculateCRC(buff1));
		let resp_a1 = mfrc522.toCard(MFRC522_CMD.TRANSCEIVE, buff1);
		console.log('resp ack 1:');
		console.log(resp_a1);
		if (typeof resp_a1 === "undefined"){
			console.log('MFRC522 error: resp_a1 is undefined');
			return;
		}
		if (!resp_a1.status){
			console.log('MFRC522 error ACK1 false status');
			return;
		}

		if (resp1.data[0] === 0x88){
			res_uid = res_uid.slice(2);
			const uid2 = [MFRC522_CMD.ANTICOL2, 0x20];
			let resp2 = mfrc522.toCard(MFRC522_CMD.TRANSCEIVE, uid2);
			if (resp2.status) {
				if (typeof resp2.data === "undefined"){
					console.log('MFRC522 error read cycle 2 prop data is undefined');
					return;
				}
				let uidCheck = 0;
				for (let i = 0; i < 4; i++) {
					if (typeof resp2.data[i] === "undefined"){
						console.log('MFRC522 error read cycle 2 data ' + i + ' is undefined');
						return;
					}
					uidCheck = uidCheck ^ resp2.data[i];
					res_uid += resp2.data[i].toString(16).padStart(2, '0');
				}
				if (uidCheck != resp2.data[4]) {
					console.log('MFRC522 error BCC2 read UID');
					return;
				}
			} else {
				console.log('MFRC522 error resp2 STATUS read UID');
				return;
			}

			// select ack 2
			if (resp1.data[0] === 0x88){
				let buff2 = [MFRC522_CMD.SELECT2, 0x70];
				for (let i = 0; i < 5; i++) {
					buff2.push(resp2.data[i]);
				}
				buff2 = buff2.concat(mfrc522.calculateCRC(buff2));
				let resp_a2 = mfrc522.toCard(MFRC522_CMD.TRANSCEIVE, buff2);
				console.log('resp ack 2:');
				console.log(resp_a2);
				if (typeof resp_a2 === "undefined"){
					console.log('MFRC522 error: resp_a2 is undefined');
					return;
				}
				if (!resp_a2.status){
					console.log('MFRC522 error ACK2 false status');
					return;
				}
			}
		}

		// beep
		if (eStore.get('beep_enabled')){
			rpio.write(buzzer_pin, rpio.LOW);
			setTimeout(() => {
				rpio.write(buzzer_pin, rpio.HIGH);
			}, 20);
		}

		if (res_uid === tmp_uid){
			console.log('MFRC522 already sent uid: ' + res_uid);
			no_find_countdown = 5;
			return;
		}

		if (tmp_uid !== ''){
			// nfc.off
		}

		console.log('MFRC522 nfc.on uid: ', res_uid);
		win.webContents.send('nfc.on', {uid: res_uid});
	}, 200);
};

const mqtt_init = (win) => {
	console.log('mqtt_init, client_id: ' + mqtt_client_id);

	mqtt_client = mqtt.connect('mqtt://' + env_mqtt_host, {
		clientId: mqtt_client_id,
		clean: true,
		keepalive: 30,
		connectTimeout: 10000,
		reconnectPeriod: 3000,
		protocolId: 'MQIsdp',
		protocolVersion: 3,
		username: "",
		password: "",
		debug: true
	});

	mqtt_client.on('connect', () => {
		console.log('MQTT CONNECTED');
	});

	mqtt_client.on('error', (err) => {
		console.log('MQTT ERR:');
		console.log(err);
	});

	mqtt_client.on('reconnect', () => {
		console.log('MQTT reconnecting...' + mqtt_client_id);
	});
};

const mqtt_terminal = (win) => {
	mqtt_init(win);
	console.log('mqtt_terminal');

	mqtt_client.on('connect', () => {
		console.log('MQTT CONNECTED');
		mqtt_client.subscribe([
			'g/s/in', 'g/p', 'scan/p'], () => {
			console.log('mqtt subscribed to topics');
		});

		setInterval(() => {
			console.log('mqtt pub -t terminal/p -m ' + mqtt_client_id);
			mqtt_client.publish('terminal/p', mqtt_client_id);
		}, 5000);
	});
};

const mqtt_gate = (win) => {
	mqtt_init(win);

	console.log('mqtt_gate');

	mqtt_client.on('connect', () => {
		console.log('MQTT CONNECTED');
		mqtt_client.subscribe([
			'g/s/in',
			'g/t/in/p',
			'g/t/out/p'], () => {
			console.log('mqtt subscribed to topics');
		});

		setInterval(() => {
			mqtt_client.publish('scan/p', '');
		}, 5000);

		ipcMain.on('gate.open', async (event) => {
			console.log('gate.open');
			mqtt_client.publish('g/open/in', '', {
				qos: 0
			}, (err) => {
					console.log('mqtt ERR on publish g/open/in');
					console.log(err);
			});
		});

		ipcMain.on('gate.open_once_with_timer', async (event, time_sec) => {
			console.log('pub g/once/in');
			mqtt_client.publish('g/once/in', time_sec.toString(), {
				qos: 0
			}, (err) => {
					console.log('mqtt ERR on publish g/once/in');
					console.log(err);
			});
		});

		ipcMain.on('gate.close', async (event) => {
			console.log('pub g/close/in');
			mqtt_client.publish('g/close/in', '', {
				qos: 0
			}, (err) => {
					console.log('mqtt ERR on publish g/close/in');
					console.log(err);
			});
		});
	});

	mqtt_client.on('message', (topic, message_buff) => {
		message = message_buff.toString();

		if (topic === 'g/s/in'){
			if (message === 'closed'){
				win.webContents.send('gate.is_closed');
			}
			if (message === 'open'){
				win.webContents.send('gate.is_open');
			}
			return;
		}

		if (topic == 'g/t/in/p'){
			console.log('sub g/t/in/p  sens.in');
			win.webContents.send('sens.in');
			return;
		}

		if (topic == 'g/t/out/p'){
			console.log('sub g/t/out/p  sens.out');
			win.webContents.send('sens.out');
			return;
		}
	});

	mqtt_client.on('error', (err) => {
		console.log('MQTT connection err: ');
		console.log(err);
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
	const assist_import_year = eStore.get('assist_import_year');
	if (!assist_import_year){
		return;
	}
	const files = dialog.showOpenDialogSync(win, {
		properties: ['openFile'],
      filters: {name: 'MS Excell', extensions: ['xls', 'xlsx']},
      message: 'Import xlsx leden uit Assist, LIDJAAR ' + assist_import_year
	});
	if (!files){
			return;
	}
	win.webContents.send('xls.assist.import', files[0]);
};

const build_menu = () => {
	const menu = new Menu();

	const assist_import_year = eStore.get('assist_import_year');

	if(assist_import_year){
		const importMenu = new Menu();
		importMenu.append(new MenuItem({ label: 'leden Assist Xlsx ' + assist_import_year, click: import_assist_xlsx }));
		menu.append(new MenuItem({ label: 'Import', submenu: importMenu }));
	}

	const exportMenu = new Menu();
	exportMenu.append(new MenuItem({ label: 'Registraties CSV (covid-19 tracing)', click: () => { win.webContents.send('reg.csv.export'); }}));
	exportMenu.append(new MenuItem({ label: 'Database JSON', click: () => { win.webContents.send('db.json.export'); }}));

	menu.append(new MenuItem({ label: 'Export', submenu: exportMenu }));
	menu.append(new MenuItem({ label: 'Instellingen', click: () => { win.webContents.send('open_config'); }} ));
	menu.append(new MenuItem({role: 'viewMenu'}));
	menu.append(new MenuItem({role: 'windowMenu'}));

	Menu.setApplicationMenu(menu);
};

build_menu();

ipcMain.on('rebuild_menu', () => {
	build_menu();
});

/**
 * fetch and store sensor data
 * (disabled, functionality will be moved to another device)
 */

const sensor_field_map = {
	water_temp: {
		sensor: "avg",
		field: 1
	},
	air_temp: {
		owm: "main.temp",
		field: 2
	},
	pressure: {
		owm: "main.pressure",
		field: 3
	},
	humidity: {
		owm: "main.humidity",
		field: 4
	},
	wind_speed: {
		owm: "wind.speed",
		field: 5
	},
	rain_1h: {
		owm: "rain.1h",
		field: 6
	},
	clouds: {
		owm: "clouds.all",
		field: 7
	},
	gate_count: {
		gate_sens: "gate_count",
		field: 8
	}
};

if (false && ((env_owm_apikey
	&& env_owm_location
	&& env_thingspeak_apikey
	&& env_temp_sensor_ip)
		|| env_temp_display_test)
	&& gate_enabled
	&& env_db_local_prefix
	&& env_db_sensor_prefix
	&& (env_db_local_prefix === env_db_sensor_prefix)
){
	const sensor_unvalidate_time = 900000; // 15 minutes

	let display_ip_ary = [];
	let display_data = {
		water: {},
		air: {}
	};

	if (env_temp_display_ips){
		display_ip_ary = env_temp_display_ips.split(',');
	}

	const cron_interval = env_temp_sensor_cron_interval ?? '5';

	console.log('Cron sensor.log enabled, interval ' + cron_interval + ' minutes');

	cron.schedule('*/' + cron_interval + ' * * * *', () => {
		win.webContents.send('sensor_log.gate_count.get');
		console.log('sensor_log.gate_count.get');
	});

	ipcMain.on('sensor_log.gate_count.fail', () => {
		console.log('sensor_log.gate_count.fail');
	});

	ipcMain.on('sensor_log.gate_count.ok', async (event, gate_count) => {
		console.log('sensor_log.gate_count.ok');

		if (env_temp_display_test){
			console.log('sensor_log blocked by env_temp_display_test');
			return;
		}

		const sensor_item = {};
		const thingspeak_item = {};

		sensor_item.gate_count = gate_count;

		try {
			let sens_resp = await axios.get('http://' + env_temp_sensor_ip + '/as');
			if (sens_resp && sens_resp.data && sens_resp.data.hasOwnProperty('avg')){
				sensor_item.water_temp = sens_resp.data.avg;
			}

			let owm_resp = await axios.get('http://api.openweathermap.org/data/2.5/weather?units=metric&lang=nl&q=' + env_owm_location + '&appid=' + env_owm_apikey);
			if (owm_resp && owm_resp.data){
				console.log('-- owm data --');
				console.log(owm_resp.data);
				let owm_data = flatten(owm_resp.data);
				for(const prp in sensor_field_map){
					if (sensor_field_map[prp].hasOwnProperty('owm')){
						if (owm_data.hasOwnProperty(sensor_field_map[prp].owm)){
							sensor_item[prp] = owm_data[sensor_field_map[prp].owm];
						} else if (prp == 'rain_1h'){
							sensor_item[prp] = 0;
						}
					}
				}
			}

			thingspeak_item.api_key = env_thingspeak_apikey;

			for (const k in sensor_item){
				let tp_key = sensor_field_map[k].field;
				thingspeak_item['field' + tp_key] = sensor_item[k];
			}

			await axios.post('https://api.thingspeak.com/update.json', thingspeak_item);

			if (Object.keys(sensor_item).length){
				console.log('sensor_log.new_item', sensor_item);
				win.webContents.send('sensor_log.new_item', sensor_item);
			} else {
				console.log('sensor_item empty');
			}
		} catch (err) {
			console.log('-- error --');
			console.log(err);
		}

		if ('water_temp' in sensor_item){
			display_data.water.value = sensor_item.water_temp;
			display_data.water.ts = (new Date()).getTime();
		}
		if ('air_temp' in sensor_item){
			display_data.air.value = sensor_item.air_temp;
			display_data.air.ts = (new Date()).getTime();
		}
	});

	let display_request_index = 0;

	setInterval(() => {
		if (!display_ip_ary.length){
			return;
		}

		if (display_request_index >= (display_ip_ary.length * 2)){
			display_request_index = 0;
		}

		let sensor_key = ['water', 'air'][display_request_index % 2];
		let display_index = Math.floor(display_request_index / 2);
		let ip = display_ip_ary[display_index];
		let ts = (new Date()).getTime();

		if (env_temp_display_test){
			display_data[sensor_key].value = Math.random() * 100;
			display_data[sensor_key].ts = (new Date()).getTime();
		}

		let sensor_valid = false;

		if (typeof display_data[sensor_key].ts === 'number'
			&& ts < (sensor_unvalidate_time + display_data[sensor_key].ts)){
			sensor_valid = true;
		}

		if (sensor_valid){
			console.log('sensor valid ' + sensor_key + ' ' + display_data[sensor_key].value);
		} else {
			console.log('sensor not valid ' + sensor_key);
		}

		ping.promise.probe(ip, {timeout: 1}).then((is_alive) => {
			if (is_alive){
				console.log('display ' + ip + ' alive');

				let display_str = '-';

				if (sensor_valid){
					display_str = display_data[sensor_key].value.toLocaleString('nl-NL', {
						minimumFractionDigits: 1,
						maximumFractionDigits: 1
					});
				}

				let get = ip;
				get += '/l';
				get += sensor_key === 'water' ? '1' : '2';
				get += '/';
				get += display_str;

				console.log('display ' + ip + ' (' + display_index + ') ' + sensor_key + ': ' + display_str);

				needle('get', get).then((res) => {
					console.log('display response ', res);
				}).catch((err) => {
					console.log('display request err ', err);
				});

			} else {
				console.log('ping ' + ip + ' not alive');
			}
		}).catch((err) => {
			console.log('ping err ' + err);
		});

		display_request_index++;
	}, 10000);

}
