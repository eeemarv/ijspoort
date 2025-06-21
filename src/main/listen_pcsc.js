import 'dotenv/config';
import { ipcMain } from 'electron';
import { NFC, TAG_ISO_14443_3, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc';
import crypto from 'crypto';

const env = process.env;

const feed_a = env?.FEED_A;
const feed_b = env?.FEED_B;
const READ_A_WRITE_B_ACCESS = '78778800';
const TRANSPORT_ACCESS = 'FF078000';
const TRANSPORT_KEY = 'ffffffffffff';

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

const handle_return = (ev_name, data, error = undefined) => {
	reader_ready = true;
	if (typeof error === 'undefined'){
		console.log(ev_name + ':: ok', data);
		return {...data};
	}
	console.log(ev_name + ':: error', data, error);
	return {...data, error};
};

const handle_error = (ev_name, data) => {
	if (!reader_ready){
		return ev_name + ':: can not reply, reader busy ...';
	}
	if (typeof rdr !== 'object'){
		return ev_name + ':: reader is not an object';
	}
	if (typeof nfc_uid !== 'string'){
		return ev_name + ':: nfc_uid is not a string';
	}
	if (typeof data !== 'object'){
		return ev_name + ':: data is not an object';
	}
	if (typeof data.nfc_uid !== 'string'){
		return ev_name + ':: data.uid is not a string';
	}
	if (nfc_uid !== data.nfc_uid){
		return ev_name + ':: data.uid to nfc_uid mismatch ';
	}
	if (typeof key_a !== 'string'){
		return ev_name + ':: key_a is not a string';
	}
	if (typeof key_b !== 'string'){
		return ev_name + ':: key_b is not a string';
	}
	if (typeof win !== 'object'){
		return ev_name + ':: win is not an object';
	}
	reader_ready = false;
	return;
};

const listen_pcsc = (wwin) => {
	win = wwin;

	ipcMain.handle('nfc.test_b', async (event, data) => {

		const error = handle_error('nfc.test_b', data);

		try {
			if (typeof error !== 'undefined'){
				throw error;
			}
			await rdr.authenticate(6, KEY_TYPE_B, key_b);
			await rdr.read(6, 16, 16);
			return handle_return('nfc.test_b', {...data});
		} catch (error) {
			return handle_return('nfc.test_b', {...data}, error);
		}
	});

	ipcMain.handle('nfc.test_transport', async (event, data) => {

		const error = handle_error('nfc.test_transport', data);

		try {
			if (typeof error !== 'undefined'){
				throw error;
			}
			await rdr.authenticate(6, KEY_TYPE_A, TRANSPORT_KEY);
			return handle_return('nfc.test_transport', {...data});
		} catch (error) {
			return handle_return('nfc.test_transport', {...data}, error);
		}
	});

	ipcMain.handle('nfc.write', async (event, data) => {

		const error = handle_error('nfc.write', data);

		try {
			if (typeof error !== 'undefined'){
				throw error;
			}

			const person = data.person;
			const member_id = person._id.substring(1).padStart(8, '0');
			const db = person.date_of_birth.split('/');
			const date_of_birth = (db[2] + db[1] + db[0]).padStart(8, '0');
			const str = date_of_birth + member_id;
			const new_access = Buffer.from(key_a + READ_A_WRITE_B_ACCESS + key_b, 'hex');
			const str_data = Buffer.alloc(16);
			str_data.write(str, 'utf-8');

			await rdr.authenticate(6, KEY_TYPE_A, TRANSPORT_KEY);
			await rdr.write(6, str_data, 16);
			await rdr.write(7, new_access, 16);
			// try key B
			await rdr.authenticate(6, KEY_TYPE_B, key_b);
			console.log('key B set for writing', nfc_uid);
			// try key A
			await rdr.authenticate(6, KEY_TYPE_A, key_a);
			console.log('key A set for reading', nfc_uid);
			return handle_return('nfc.write', {...data});
		} catch (error){
			return handle_return('nfc.write', {...data}, error);
		}
	});

	ipcMain.handle('nfc.read', async (event, data) => {

		const error = handle_error('nfc.read', data);

		try {
			if (typeof error !== 'undefined'){
				throw error;
			}

			await rdr.authenticate(6, KEY_TYPE_A, key_a);
			const read_data = await rdr.read(6, 16, 16);
			const str = read_data.toString();
			const byear = str.substring(0, 4);
			const bmonth = str.substring(4, 6);
			const bdate = str.substring(6, 8);
			const date_of_birth = byear + '.' + bmonth + '.' + bdate;
			const member_id = str.substring(8, 16);
			return handle_return('nfc.read', {
				...data,
				date_of_birth,
				member_id
			});
		} catch (error) {
			return handle_return('nfc.read', {...data}, error);
		}
	});

	ipcMain.handle('nfc.reset', async (event, data) => {

		const error = handle_error('nfc.reset', data);

		try {
			if (typeof error !== 'undefined'){
				throw error;
			}

			const reset_access = Buffer.from(TRANSPORT_KEY + TRANSPORT_ACCESS + TRANSPORT_KEY, 'hex');
			const null_data = Buffer.alloc(16);

			await rdr.authenticate(6, KEY_TYPE_B, key_b);
			await rdr.write(6, null_data, 16);
			await rdr.write(7, reset_access, 16);
			// try transport_key
			await rdr.authenticate(6, KEY_TYPE_A, TRANSPORT_KEY);
			return handle_return('nfc.reset', {...data});
		} catch (error){
			return handle_return('nfc.reset', {...data}, error);
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
