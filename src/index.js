const { app, BrowserWindow, ipcMain } = require('electron');
const { NFC } = require('nfc-pcsc');
const EidReader = require('./eid_reader');
const path = require('path');

// Live Reload
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
	height: 800,
	show: false,
	darkTheme: true,
	backgroundColor: '#000000',
    webPreferences: {
	  /*
	  worldSafeExecuteJavaScript: true,
	  contextIsolation: true,
	  */
      nodeIntegration: true,
	  nodeIntegrationInWorker: true,
	  enableRemoteModule: true
    }
  });

  win.setMinimumSize(1400, 768);

  win.loadFile(path.join(__dirname, '../public/index.html'))
  .then(() => {
	console.log('win then');
	listenPcsc(win);
  });

  win.webContents.openDevTools({
    'mode': 'bottom'
  });

  win.once('ready-to-show', () => {
	console.log('win event ready-to-show');
	win.show();
  });

  return win;
};

const listenPcsc = (win) => {
	const pcsc = new NFC();
	const eid_reader = new EidReader();

	pcsc.on('error', err => {
		win.webContents.send('device.error', err);
	});

	pcsc.on('reader', reader => {
		if (reader.name.toLowerCase().indexOf('acr122') === -1) {
			return;
		}

		console.log('dev.nfc.on', reader.reader.name);
		win.webContents.send('dev.nfc.on');

		reader.on('card', card => {
			console.log(reader.reader.name, 'nfc.on', card);
			win.webContents.send('nfc.on', card);
		});

		reader.on('card.off', card => {
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

	pcsc.on('reader', reader => {
		if (reader.name.toLowerCase().indexOf('acr122') !== -1) {
			return;
		}

		console.log(reader.reader.name, 'dev.eid.on');
		reader.autoProcessing = false;
		win.webContents.send('dev.eid.on');

		reader.on('card', card => {
			win.webContents.send('eid.wait');

			let eid_slot = eid_reader.get_slot();

			if (typeof eid_slot === 'undefined'){
				console.log(reader.reader.name, 'eid.undefined', card);
				win.webContents.send('eid.undefined');
				return;
			}
			let eid = eid_reader.read(eid_slot);
			if (typeof eid === 'undefined'){
				console.log(reader.reader.name, 'eid.undefined', card);
				win.webContents.send('eid.undefined');
				return;
			}

			console.log('eid.on', eid);
			win.webContents.send('eid.on', eid);
		});

		reader.on('card.off', card => {
			console.log(reader.reader.name, 'eid.of');
			win.webContents.send('eid.off');
		});

		reader.on('error', err => {
			console.log(reader.reader.name, 'dev.eid.error', err);
			win.webContents.send('dev.eid.error', err);
		});

		reader.on('end', () => {
			console.log(reader.reader.name, 'dev.eid.off');
			win.webContents.send('dev.eid.off');
		});
	});
};

app.on('ready', () => {
	createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('xlsx-import-btn-clicked', (ev) => {
	cconsole.log('click-handle');
	importXlsxFileFromUser();
});
