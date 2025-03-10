import 'dotenv/config';
import { ipcMain } from 'electron';
import { NFC, TAG_ISO_14443_3, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc';
import crypto from 'crypto';

const env = process.env;

const feed_a = env?.FEED_A;
const feed_b = env?.FEED_B;
const read_a_write_b_access = '78778800';
const transport_access = 'FF078000';
const transport_key = 'ffffffffffff';

if (typeof feed_a !== 'string' || !feed_a){
	throw 'No FEED_A set!';
}

if (typeof feed_b !== 'string' || !feed_b){
	throw 'No FEED_B set!';
}

let win = undefined;
let nfc_uid = undefined;
let rdr = undefined;
let key_a = undefined;
let key_b = undefined;
let reader_ready = false;

const unset_reader = () => {
	rdr = undefined;
	key_a = undefined;
	key_b = undefined;
	reader_ready = false;
};

const win_send = (ev_name, data = undefined) => {
	console.log(ev_name, data);
	win.webContents.send(ev_name, data);
};

const event_reply = (ev, reply_ev_name, data) => {
	console.log(reply_ev_name, data);
	reader_ready = true;
	ev.reply(reply_ev_name, data);
};

const can_reply = (ev_name, data) => {
	if (!reader_ready){
		console.log(ev_name + ' can not reply, reader busy ...');
		return false;
	}
	if (typeof rdr !== 'object'){
		console.log('reader is not an object');
		return false;
	}
	if (typeof nfc_uid !== 'string'){
		console.log('nfc_uid is not a string');
		return false;
	}
	if (typeof data !== 'object'){
		console.log('data is not an object');
		return false;
	}
	if (typeof data.nfc_uid !== 'string'){
		console.log('data.uid is not a string');
		return false;
	}
	if (nfc_uid !== data.nfc_uid){
		console.log('data.uid to nfc_uid mismatch', data, nfc_uid);
		return false;
	}
	if (typeof key_a !== 'string'){
		console.log('key_a is not a string');
		return false;
	}
	if (typeof key_b !== 'string'){
		console.log('key_b is not a string');
		return false;
	}
	if (typeof win !== 'object'){
		console.log('win is not an object');
		return false;
	}

	console.log('reply to ' + ev_name);
	reader_ready = false;
	return true;
};

const listen_pcsc = (wwin) => {
	win = wwin;

	ipcMain.on('nfc.test_a_key', async (event, data) => {
		if (!can_reply('nfc.test_a_key', data)){
			return;
		}

		try {
			await rdr.authenticate(6, KEY_TYPE_A, key_a);
			await rdr.read(6, 16, 16);
			event_reply(event, 'nfc.test_a_key.ok', {...data});
		} catch (err) {
			console.log(err);
			event_reply(event, 'nfc.test_a_key.fail', {...data});
		}
	});

	ipcMain.on('nfc.test_b_key', async (event, data) => {
		if (!can_reply('nfc.test_b_key', data)){
			return;
		}

		try {
			await rdr.authenticate(6, KEY_TYPE_B, key_b);
			await rdr.read(6, 16, 16);
			event_reply(event, 'nfc.test_b_key.ok', {...data});
		} catch (err) {
			console.log(err);
			event_reply(event, 'nfc.test_b_key.fail', {...data});
		}
	});

	ipcMain.on('nfc.test_transport_key', async (event, data) => {
		if (!can_reply('nfc.test_transport_key', data)){
			return;
		}

		try {
			await rdr.authenticate(6, KEY_TYPE_A, transport_key);
			event_reply(event, 'nfc.test_transport_key.ok', {...data});
		} catch (err) {
			console.log(err);
			event_reply(event, 'nfc.test_transport_key.fail', {...data});
		}
	});

	ipcMain.on('nfc.init', async (event, data) => {
		if (!can_reply('nfc.init',  data)){
			return;
		}
		const person = data.person;
		const member_id = person._id.substring(1).padStart(8, '0');
		const db = person.date_of_birth.split('/');
		const date_of_birth = (db[2] + db[1] + db[0]).padStart(8, '0');
		const str = date_of_birth + member_id;
		const new_access = Buffer.from(key_a + read_a_write_b_access + key_b, 'hex');
		const str_data = Buffer.alloc(16);
		str_data.write(str, 'utf-8');
		try {
			await rdr.authenticate(6, KEY_TYPE_A, transport_key);
			await rdr.write(6, str_data, 16);
			await rdr.write(7, new_access, 16);
			// try key B
			await rdr.authenticate(6, KEY_TYPE_B, key_b);
			console.log('key B set for writing', nfc_uid);
			// try key A
			await rdr.authenticate(6, KEY_TYPE_A, key_a);
			console.log('key A set for reading', nfc_uid);
			event_reply(event, 'nfc.init.ok', {...data});
		} catch (err){
			console.log(err);
			event_reply(event, 'nfc.init.fail', {...data});
		}
	});

	ipcMain.on('nfc.read', async (event, data) => {
		if (!can_reply('nfc.read', data)){
			return;
		}

		try {
			await rdr.authenticate(6, KEY_TYPE_A, key_a);
			const read_data = await rdr.read(6, 16, 16);
			const str = read_data.toString();
			const byear = str.substring(0, 4);
			const bmonth = str.substring(4, 6);
			const bdate = str.substring(6, 8);
			const date_of_birth = byear + '.' + bmonth + '.' + bdate;
			const member_id = str.substring(8, 16);
			event_reply(event, 'nfc.read.ok', {
				...data,
				date_of_birth,
				member_id
			});
		} catch (err) {
			console.log(err);
			event_reply(event, 'nfc.read.fail', {...data});
		}
	});

	ipcMain.on('nfc.reset', async (event, data) => {
		if (!can_reply('nfc.reset', data)){
			return;
		}
		const reset_access = Buffer.from(transport_key + transport_access + transport_key, 'hex');
		const null_data = Buffer.alloc(16);
		try {
			await rdr.authenticate(6, KEY_TYPE_B, key_b);
			await rdr.write(6, null_data, 16);
			await rdr.write(7, reset_access, 16);
			// try transport_key
			await rdr.authenticate(6, KEY_TYPE_A, transport_key);
			event_reply(event, 'nfc.reset.ok', {...data});
		} catch (err){
			console.log(err);
			event_reply(event, 'nfc.reset.fail', {...data});
		}
	});

	const pcsc = new NFC();

	pcsc.on('error', err => {
		win_send('device.error', err);
	});

	pcsc.on('reader', reader => {
		if (reader.name.toLowerCase().indexOf('acr122') === -1) {
			return;
		}

		win_send('dev.nfc.on', {
			reader: reader.reader.name
		});

		reader.on('card', async (card) => {
			//remove_nfc_listeners();

			if (card.type !== TAG_ISO_14443_3){
				console.log('It\'s not a ISO 14443-3 tag');
				return;
			}

			if (typeof card.uid !== 'string'){
				console.log('UID not set');
				return;
			}

			console.log(reader.reader.name);

			rdr = reader;
			nfc_uid = card.uid.toLowerCase();
			key_b = crypto.createHash('sha256').update(feed_b + nfc_uid).digest('hex').substr(0, 12);
			key_a = crypto.createHash('sha256').update(feed_a + nfc_uid).digest('hex').substr(0, 12);
			rdr = reader;
			reader_ready = true;

			console.log('key_b', key_b);
			console.log('key_a', key_a);

			win_send('nfc.on', {nfc_uid});
		});

		reader.on('card.off', (card) => {
			unset_reader();
			win_send('nfc.off', {nfc_uid});
			nfc_uid = undefined;
		});

		reader.on('error', (error) => {
			unset_reader();
			nfc_uid = undefined;
			win_send('dev.nfc.error', {error});
		});

		reader.on('end', () => {
			unset_reader();
			nfc_uid = undefined;
			win_send('dev.nfc.off');
		});
	});
}

export default listen_pcsc;
