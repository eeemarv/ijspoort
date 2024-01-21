const MFRC522 = require('mfrc522-rpi');
const SoftSPI = require('rpi-softspi');
const rpio = require('rpio');

const buzzer_pin = 18;
const beep_time = 20; 

// connect to mfrc522
const clock_pin = 23;
const mosi_pin = 19;
const miso_pin = 21;
const cs_pin = 24;

const probe_interval = 50;
const steps_hold_after_uid_found = 20; // 20 * 50 ms = 1 sec

function listen_mfrc(win, eStore){
	const softSPI = new SoftSPI({
		clock: clock_pin,
		mosi: mosi_pin,
		miso: miso_pin,
		client: cs_pin
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

		console.log('Card detected: ', resp0);

		//
		let tmp_uid = res_uid;
		mfrc522.writeRegister(MFRC522_CMD.BitFramingReg, 0x00);
		const uid1 = [MFRC522_CMD.ANTICOL1, 0x20];
		res_uid = '';
		let resp1 = mfrc522.toCard(MFRC522_CMD.TRANSCEIVE, uid1);
		if (resp1.status) {
			if (typeof resp1.data === 'undefined'){
				console.log('MFRC522 error read cycle 1 prop data is undefined');
				return;
			}
			let uidCheck = 0;
			for (let i = 0; i < 4; i++) {
				if (typeof resp1.data[i] === 'undefined'){
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
		console.log('resp ack 1: ', resp_a1);
		if (typeof resp_a1 === 'undefined'){
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
				if (typeof resp2.data === 'undefined'){
					console.log('MFRC522 error read cycle 2 prop data is undefined');
					return;
				}
				let uidCheck = 0;
				for (let i = 0; i < 4; i++) {
					if (typeof resp2.data[i] === 'undefined'){
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
				if (typeof resp_a2 === 'undefined'){
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
			}, beep_time);
		}

		if (res_uid === tmp_uid){
			console.log('MFRC522 already sent uid: ' + res_uid);
			no_find_countdown = steps_hold_after_uid_found;
			return;
		}

		/*
		if (tmp_uid !== ''){
			// nfc.off
		}
		*/

		console.log('MFRC522 nfc.on uid: ', res_uid);
		win.webContents.send('nfc.on', {uid: res_uid});
	}, probe_interval);
};

module.exports = listen_mfrc;