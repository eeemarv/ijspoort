require('dotenv').config();
const { ipcMain } = require('electron');
const { NFC, TAG_ISO_14443_3, KEY_TYPE_A, KEY_TYPE_B } = require('nfc-pcsc');
const crypto = require('crypto');

const env = process.env;

const feed_A = env?.FEED_A;
const feed_B = env?.FEED_B;

if (typeof feed_A !== 'string' || !feed_A){
	throw 'No FEED_A set!';
}

if (typeof feed_B !== 'string' || !feed_B){
	throw 'No FEED_B set!';
}

const read_a_write_b_access = '78778800';
const transport_access = 'FF078000';
const transport_key = 'ffffffffffff';

const remove_nfc_listeners = () => {
	ipcMain.removeAllListeners('nfc.test_a_key');
	ipcMain.removeAllListeners('nfc.test_b_key');
	ipcMain.removeAllListeners('nfc.test_transport_key');
	ipcMain.removeAllListeners('nfc.init');
	ipcMain.removeAllListeners('nfc.read');
	ipcMain.removeAllListeners('nfc.reset');
};

function listen_pcsc(win){
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
}

module.exports = listen_pcsc;
