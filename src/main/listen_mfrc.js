"use strict";

import { MFRC522Scan } from './mfrc522/mfrc522';
import rpio from 'rpio';
import { e_store_get } from './e_store';

const buzzer_pin = 18;
const buzzer_time = 20;

const uid_timeout_ms = 500;
let uid_timeout_id;
let uid_send;

const listen_mfrc = (win) => {
	rpio.open(buzzer_pin, rpio.OUTPUT);
	rpio.write(buzzer_pin, rpio.HIGH);

	const scan = new MFRC522Scan();

	scan.onSpeed((speed) => {
		win.webContents.send('dev.nfc.speed', speed);
	});

	scan.onDeviceDown(() => {
		win.webContents.send('dev.nfc.off');
	});

	scan.onDeviceUp(() => {
		win.webContents.send('dev.nfc.on');
	});

	scan.onTag((uidAry) => {
		let nfc_uid = '';
		for (const b of uidAry){
			nfc_uid += b.toString(16).padStart(2, '0');
		}

		clearTimeout(uid_timeout_id);
		uid_timeout_id = setTimeout(() => {
			win.webContents.send('nfc.off');
			uid_send = undefined;
		}, uid_timeout_ms);

		if (uid_send === nfc_uid){
			// uid already send, skip
			return;
		}

		// beep
		if (e_store_get('gate_beep_enabled', false)){
			rpio.write(buzzer_pin, rpio.LOW);
			setTimeout(() => {
				rpio.write(buzzer_pin, rpio.HIGH);
			}, buzzer_time);
		}

		win.webContents.send('nfc.on', {nfc_uid});
		uid_send = nfc_uid;
	});

	scan.scan();
};

export {listen_mfrc};