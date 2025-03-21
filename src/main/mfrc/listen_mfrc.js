"use strict";

import { MFRC522 } from './mfrc522';
import rpio from 'rpio';
import { e_store_get } from '../e_store';

// connect mfrc522 to Raspberry Pi 4 B
const reset_pin = 22;
const buzzer_pin = 18;

const buzzer_time = 20;
const probe_interval = 200;
const steps_hold_after_uid_found = 6;

const listen_mfrc = (win) => {
	rpio.open(buzzer_pin, rpio.OUTPUT);
	rpio.write(buzzer_pin, rpio.HIGH);

	const mfrc522 = new MFRC522().setResetPin(reset_pin);

	console.log('MFRC522 send event dev.nfc.on');
	win.webContents.send('dev.nfc.on');

	let nfc_uid = '';
	let no_find_countdown = 0;

	setInterval(function() {
		if (no_find_countdown){
			no_find_countdown--;
		}

		mfrc522.reset();

		const resp = mfrc522.findCard();

		if (!resp.success){
			if (nfc_uid !== '' && !no_find_countdown){
				console.log('MFRC522 send event nfc.off');
				win.webContents.send('nfc.off');
				nfc_uid = '';
			}
			return;
		}

		console.log('Card detected: ', resp);

		//
		const prev_uid = nfc_uid;

		const resp_uid = mfrc522.getUid();

		if (!resp_uid.success){
			return;
		}

		nfc_uid = resp.uid;

		// beep
		if (e_store_get('gate_beep_enabled', false)){
			rpio.write(buzzer_pin, rpio.LOW);
			setTimeout(() => {
				rpio.write(buzzer_pin, rpio.HIGH);
			}, buzzer_time);
		}

		if (nfc_uid === prev_uid){
			console.log('MFRC522 already sent uid: ' + nfc_uid);
			no_find_countdown = steps_hold_after_uid_found;
			return;
		}

		console.log('MFRC522 nfc.on uid: ', nfc_uid);
		win.webContents.send('nfc.on', {nfc_uid});
	}, probe_interval);
};

export { listen_mfrc };