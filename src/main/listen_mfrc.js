"use strict";

import { MFRC522Scan } from './mfrc522/mfrc522';
import { Chip, Line } from 'node-libgpiod'
import { e_store_get } from './e_store';

const BUZZER_GPIO = 24; // Corresponds to physical pin 18 on RPi 4B
const BUZZER_TIME = 20;
const buz = {};

const UID_TIMEOUT_MS = 500;
let uid_timeout_id;
let uid_send;

const listen_mfrc = (win) => {
	buz.gpiochip = new Chip('gpiochip0');
	buz.p = new Line(buz.gpiochip, BUZZER_GPIO);
	buz.p.requestOutputMode('ijspoort-buzzer', 1);

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
		}, UID_TIMEOUT_MS);

		if (uid_send === nfc_uid){
			// uid already send, skip
			return;
		}

		// beep
		if (e_store_get('gate_beep_enabled', false)){
			buz.p.setValue(0);
			setTimeout(() => {
				buz.p.setValue(1);
			}, BUZZER_TIME);
		}

		win.webContents.send('nfc.on', {nfc_uid});
		uid_send = nfc_uid;
	});

	scan.scan();
};

export {listen_mfrc};