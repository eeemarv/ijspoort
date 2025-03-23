import 'dotenv/config';
import { ipcMain } from 'electron';
import mqtt from 'mqtt';

const env = process.env;
const env_mqtt_host = env.MQTT_HOST;
const kiosk_modus = env.KIOSK === 1 || env.GATE === '1';
const mqtt_client_type = kiosk_modus ? 'kiosk' : 'desk';
const mqtt_client_id = mqtt_client_type + '_' + Math.random().toString(16).slice(3).substring(0,4);

const topics_subscr_common = () => {
	return [
		'we/water_temp',
		'we/air_temp',
		'g/stat/in',
		'g/p'
	];
};

const topics_subscr_kiosk_modus = () => {
	if (!kiosk_modus){
		return [];
	}
	return [
		'g/sens/in',
		'g/sens/out',
	];
};

const topics_subscr_desk_modus = () => {
	if (kiosk_modus){
		return [];
	}
	return [
		'scan/gate/wait',
		'scan/gate/full',
		'scan/gate/nfc_not_found',
		'scan/gate/nfc_blocked',
		'scan/gate/person_not_found',
		'scan/gate/person_not_member',
		'scan/gate/person_valid_member',
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
		...topics_subscr_kiosk_modus(),
		...topics_subscr_desk_modus()
	];

	const on_main_to_mqtt = (ev_main, ev_mqtt) => {
		console.log('listen to ipcMain.on ' + ev_main + ', relay to mqtt ' + ev_mqtt);
		ipcMain.on(ev_main, async (ev, msg = '') => {
			console.log('on_main ' + ev_main + ' ' + msg + ' > ev_mqtt ' + ev_mqtt);
			mqtt_client.publish(ev_mqtt, '' + msg, {}, (err) => {
				if (err){
					console.log(err);
				}
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
			case 'g/stat/in':
				if (msg === 'closed'){
					win.webContents.send('gate.is_closed');
				}
				if (msg === 'open'){
					win.webContents.send('gate.is_open');
				}
				break;
			case 'g/sens/in':
				win.webContents.send('sens.in');
				break;
			case 'g/sens/out':
				win.webContents.send('sens.out');
				break;
			case 'g/p':
				win.webContents.send('gate.pulse');
				break;

			case 'scan/gate/wait':
				win.webContents.send('scan.gate.wait', msg);
				break;
			case 'scan/gate/full':
				win.webContents.send('scan.gate.full', msg);
				break;

			case 'scan/gate/nfc_not_found':
				win.webContents.send('scan.gate.nfc_not_found', msg);
				break;
			case 'scan/gate/nfc_blocked':
				win.webContents.send('scan.gate.nfc_blocked', msg);
				break;

			case 'scan/gate/person_not_found':
				win.webContents.send('scan.gate.person_not_found', msg);
				break;
			case 'scan/gate/person_not_member':
				win.webContents.send('scan.gate.person_not_member', msg);
				break;
			case 'scan/gate/person_valid_member':
				win.webContents.send('scan.gate.person_valid_member', msg);
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

	if (kiosk_modus){
		on_main_to_mqtt('gate.open', 'g/open/in');
		on_main_to_mqtt('gate.open_once_with_timer', 'g/once/in');
		on_main_to_mqtt('gate.close', 'g/close/in');

		on_main_to_mqtt('scan.gate.wait', 'scan/gate/wait');
		on_main_to_mqtt('scan.gate.full', 'scan/gate/full');

		on_main_to_mqtt('scan.gate.nfc_not_found', 'scan/gate/nfc_not_found');
		on_main_to_mqtt('scan.gate.nfc_blocked', 'scan/gate/nfc_blocked');

		on_main_to_mqtt('scan.gate.person_not_found', 'scan/gate/person_not_found');
		on_main_to_mqtt('scan.gate.person_not_member', 'scan/gate/person_not_member');
		on_main_to_mqtt('scan.gate.person_valid_member', 'scan/gate/person_valid_member');

		setInterval(() => {
			mqtt_client.publish('scan/p', mqtt_client_id, {}, (err) => {
				if (err){
					console.log(err);
				}
			});
		}, 5000);
	}

	if (!kiosk_modus){
		setInterval(() => {
			mqtt_client.publish('desk/p', mqtt_client_id, {}, (err) => {
				if (err){
					console.log(err);
				}
			});
		}, 5000);
	}
}

export { mqtt_init };
