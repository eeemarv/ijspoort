const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

/////////
/////////
const { NFC } = require('nfc-pcsc');
const { spawn } = require('child_process');
import Eid from './eid';
/////////
////////

let window = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
	  nodeIntegrationInWorker: true,
	  enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  window.webContents.openDevTools({
    'mode': 'bottom'
  });
};

app.on('ready', createWindow);

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



/////////
/////////

const nfc = new NFC();

nfc.on('reader', reader => {
	if (reader.name.toLowerCase().indexOf('acr122') === -1) {
		reader.autoProcessing = false;
		window.webContents.send('eid-reader');
	} else {
		window.webContents.send('nfc-reader');
	}

	console.log(`${reader.reader.name}  device attached`);

	reader.on('card', card => {
		console.log(`${reader.reader.name}  card inserted`, card);
		window.webContents.send('card', card);

		if (reader.autoProcessing){
			console.log('uid:: ' + card.uid);
			window.webContents.send('nfc', card);
		}

		if (!reader.autoProcessing){
			var eidenv = spawn('eidenv');
			eidenv.on('error', function(err) {
				console.log('stderr: <'+err+'>' );
				window.webContents.send('eidenv-error', err);
			});

		eidenv.stdout.on('data', function (eidenv_out) {
			let eid = new Eid(eidenv_out.toString());
			console.log(eid);
			if (eid.name === ''){
				window.webContents.send('eid-empty', eid);
			} else {
				window.webContents.send('eid', eid);
			}
		});

		eidenv.stderr.on('data', function (data) {
			console.log('stderr: <'+data+'>' );
			window.webContents.send('eid-error', data);
		});
		}
	});

	reader.on('card.off', card => {
		console.log(`${reader.reader.name}  card removed`, card);
		if (reader.autoProcessing){
			window.webContents.send('nfc-off', card);
		} else {
			window.webContents.send('eid-off', card);
		}
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
		if (reader.autoProcessing){
			window.webContents.send('nfc-reader-error', err);
		} else {
			window.webContents.send('eid-reader-error', err);
		}
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
		if (reader.autoProcessing){
			window.webContents.send('nfc-reader-end');
		} else {
			window.webContents.send('eid-reader-end');
		}
	});
});

nfc.on('error', err => {
	console.log('an error occurred', err);
	window.webContents.send('pcsc-error', err);
});
