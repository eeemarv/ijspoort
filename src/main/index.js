import 'dotenv/config';
import { app, BrowserWindow } from 'electron';
import path from 'path';
//import listen_mfrc from './listen_mfrc.js';
import build_menu from './build_menu.js';
import listen_import_file_select from './listen_import_file_select.js';
import { mqtt_init } from './mqtt.js';
import listen_pcsc from './listen_pcsc.js';
import EStore from 'electron-store';

EStore.initRenderer();

let win;

const env = process.env;

const debug_enabled = env.DEBUG === '1';
const gate_modus = env.GATE === '1';
const mfrc522_enabled = env.MFRC522 === '1';

// https://stackoverflow.com/questions/68874940/gpu-process-isnt-usable-goodbye
//app.commandLine.appendSwitch('in-process-gpu');
//app.commandLine.appendSwitch('no-sandbox');

// Live Reload
/**
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true
});
**/

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
/**
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
*/

const createWindow = () => {
  win = new BrowserWindow({
    width: 1400,
		height: 768,
		show: false,
		darkTheme: true,
		backgroundColor: '#000010',
		icon: path.join(__dirname, '/../../icon/512x512.png'),
    webPreferences: {
			preload: path.join(__dirname, '/../preload/preload.js'),
			sandbox: false,
			contextIsolation: true,

			// to_remove
			/*
      nodeIntegration: false,
			nodeIntegrationInWorker: false,
			enableRemoteModule: false
			*/
    }
  });

	if (!gate_modus){
		win.setMinimumSize(1366, 768);
		win.maximize();
	}

  if (gate_modus && !debug_enabled){
		win.setKiosk(true);
  }

  win.loadFile(path.join(__dirname, '../renderer/index.html'))
  .then(() => {
		console.log('win then');
		listen_pcsc(win);
		//e_store_handle();

		/**
		if (mfrc522_enabled){
			try {
				// disabled for now, to write own mfrc522 interface
				// listen_mfrc(win);
			} catch (err) {
				console.log(err);
			}
		}
		*/

		mqtt_init(win);
		if (!gate_modus){
			build_menu(win);
			listen_import_file_select(win);
		}
  });

  if (debug_enabled){
		win.webContents.openDevTools({
			'mode': 'bottom'
		});
  }

  win.once('ready-to-show', () => {
		console.log('win event ready-to-show');
		win.show();
  });

};

app.on('ready', () => {
	createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  console.log('all windows closed');
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/* menu does not change for now
ipcMain.on('rebuild_menu', () => {
	build_menu(win);
});
*/