require('dotenv').config();
const { ipcMain } = require('electron');
const mqtt = require('mqtt');

const env = process.env;
const env_mqtt_host = env.MQTT_HOST;
const gate_modus = env?.GATE === '1';
const mqtt_client_type = gate_modus ? 'gate' : 'desk';
const mqtt_client_id = mqtt_client_type + '_' + Math.random().toString(16).slice(3).substring(0,4);

const topics_subscr_common = () => {
	return [
		'we/water_temp',
		'we/air_temp',
		'g/s/in',
		'g/p'
	];
};

const topics_subscr_gate_modus = () => {
	if (!gate_modus){
		return [];
	}
	return [
		'g/t/in/p',
		'g/t/out/p',
	];
};

const topics_subscr_desk_modus = () => {
	if (gate_modus){
		return [];
	}
	return [
		'scan/nfc_not_found',
		'scan/nfc_blocked',
		'scan/nfc_blocked_ignored',
		'scan/person_already_registered',			
		'scan/person_not_found',
		'scan/person_not_member',
		'scan/person_valid_member',
		'scan/p'	
	];
}

const mqtt_init = (win) => {

	console.log('mqtt_init, client_id: ' + mqtt_client_id);

	// local network, not secured 
	const mqtt_client = mqtt.connect('mqtt://' + env_mqtt_host, {
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

	const topic_subscr_ary = [
		...topics_subscr_common(),
		...topics_subscr_gate_modus(),
		...topics_subscr_desk_modus()
	];

	const on_main_to_mqtt = (ev_main, ev_mqtt) => {
		console.log('listen to ipcMain.on ' + ev_main + ', relay to mqtt ' + ev_mqtt);
		ipcMain.on(ev_main, async (ev, msg = '') => {
			console.log('on_main ' + ev_main + ' ' + msg + ' > ev_mqtt ' + ev_mqtt);
			mqtt_client.publish(ev_mqtt, '' + msg, {
				qos: 0
			}, (err) => {
					console.log('mqtt ERR on publish ' + ev_mqtt, err);
			});
		});
	};

	console.log('mqtt topics to subscribe:', topic_subscr_ary);

	mqtt_client.on('connect', () => {
		console.log('MQTT CONNECTED');

		mqtt_client.subscribe(topic_subscr_ary, () => {
			console.log('mqtt subscribed to topics', topic_subscr_ary);
		});
	});

	mqtt_client.on('error', (err) => {
		console.log('MQTT ERR:', err);
	});

	mqtt_client.on('reconnect', () => {
		console.log('MQTT reconnecting...' + mqtt_client_id);
	});

	mqtt_client.on('message', (topic, message_buff) => {
		const msg = message_buff.toString();
		console.log('mqtt rx -t ' + topic + ' -m ' + msg);
		switch (topic){
			case 'g/s/in':
				if (msg === 'closed'){
					win.webContents.send('gate.is_closed');
				}
				if (msg === 'open'){
					win.webContents.send('gate.is_open');
				}
				break;
			case 'g/t/in/p':
				win.webContents.send('sens.in');				
				break;
			case 'g/t/out/p':
				win.webContents.send('sens.out');
				break;
			case 'g/p':
				win.webContents.send('gate.pulse');
				break;

			case 'scan/nfc_not_found':
				win.webContents.send('scan.nfc_not_found', msg);
				break;
			case 'scan/nfc_blocked':
				// msg: nfc_id
				win.webContents.send('scan.nfc_blocked', msg);
				break;
			case 'scan/nfc_blocked_ignored':
				// msg: nfc_id
				win.webContents.send('scan.nfc_blocked_ignored', msg);
				break;

			case 'scan/person_already_registered':
				// msg: nfc_id
				win.webContents.send('scan.person_already_registered', msg);
				break;
			case 'scan/person_not_found':
				// msg: nfc_id
				win.webContents.send('scan.person_not_found', msg);
				break;
			case 'scan/person_not_member':
				// msg: nfc_id
				win.webContents.send('scan.person_not_member', msg);
				break;
			case 'scan/person_valid_member':
				// msg: nfc_id
				win.webContents.send('scan.person_valid_member', msg);
				break;

			case 'scan/p':
				win.webContents.send('scan.pulse');
				break;
			case 'we/water_temp': 
				win.webContents.send('water_temp', msg);
				break;
			case 'we/air_temp': 
				win.webContents.send('air_temp', msg);
				break;
			default:
				break;
		}
	});

	if (gate_modus){
		on_main_to_mqtt('gate.open', 'g/open/in');
		on_main_to_mqtt('gate.open_once_with_timer', 'g/once/in');
		on_main_to_mqtt('gate.close', 'g/close/in');

		on_main_to_mqtt('scan.nfc_not_found', 'scan/nfc_not_found');
		on_main_to_mqtt('scan.nfc_blocked', 'scan/blocked');
		on_main_to_mqtt('scan.nfc_blocked_ignored', 'scan/nfc_blocked_ignored');
	
		on_main_to_mqtt('scan.person_already_registered', 'scan/person_already_registered');
		on_main_to_mqtt('scan.person_not_found', 'scan/person_not_found');		
		on_main_to_mqtt('scan.person_not_member', 'scan/person_not_member');
		on_main_to_mqtt('scan.person_valid_member', 'scan/person_valid_member');

		setInterval(() => {
			mqtt_client.publish('scan/p', '' + mqtt_client_id);
		}, 5000);
	}

	if (!gate_modus){
		setInterval(() => {
			mqtt_client.publish('desk/p', '' + mqtt_client_id);
		}, 5000);
	}
}

module.exports = { mqtt_init };
