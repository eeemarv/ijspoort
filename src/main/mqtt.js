require('dotenv').config();
const { ipcMain } = require('electron');
const mqtt = require('mqtt');

const env = process.env;
const env_mqtt_host = env.MQTT_HOST;
const gate_enabled = env?.GATE === '1';
const mqtt_client_type = gate_enabled ? 'gate' : 'term';
const mqtt_client_id = mqtt_client_type + '_' + Math.random().toString(16).slice(3).substring(0,4);

let mqtt_client;

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

		mqtt_client.subscribe([
			'we/water_temp',
			'we/air_temp'], () => {
			console.log('mqtt subscribed to topics we/water_temp, we/air_temp');
		});
	});

	mqtt_client.on('error', (err) => {
		console.log('MQTT ERR:');
		console.log(err);
	});

	mqtt_client.on('reconnect', () => {
		console.log('MQTT reconnecting...' + mqtt_client_id);
	});

	mqtt_client.on('message', (topic, message_buff) => {
		let msg = message_buff.toString();

		console.log('mqtt rx -t ' + topic + ' -m ' + msg);

		if (topic === 'we/water_temp'){
			win.webContents.send('water_temp', parseFloat(msg));
			return;
		}

		if (topic === 'we/air_temp'){
			win.webContents.send('air_temp', parseFloat(msg));
		}

	});
};

function mqtt_term(win){

	mqtt_init(win);

	console.log('mqtt_term');

	mqtt_client.on('connect', () => {
		console.log('MQTT CONNECTED');
		mqtt_client.subscribe([
			'g/s/in', 'g/p', 'scan/p'], () => {
			console.log('mqtt subscribed to topics');
		});

		setInterval(() => {
			console.log('mqtt pub -t term/p -m ' + mqtt_client_id);
			mqtt_client.publish('term/p', mqtt_client_id);
		}, 5000);
	});
}

function mqtt_gate(win){

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
		let msg = message_buff.toString();

		if (topic === 'g/s/in'){

			if (msg === 'closed'){
				win.webContents.send('gate.is_closed');
			}

			if (msg === 'open'){
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
}

module.exports = {
  mqtt_term,
  mqtt_gate
};
