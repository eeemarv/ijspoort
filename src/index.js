require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const EStore = require('electron-store');
const path = require('path');

const listen_pcsc = require('./main/listen_pcsc.js');
const listen_mfrc = require('./main/listen_mfrc.js');
const build_menu = require('./main/build_menu.js');
const { mqtt_term, mqtt_gate } = require('./main/mqtt.js');

const eStore = new EStore();
let win;

const env = process.env;

const debug_enabled = env?.DEBUG === '1';
const gate_enabled = env?.GATE === '1';

// https://stackoverflow.com/questions/68874940/gpu-process-isnt-usable-goodbye
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('no-sandbox');

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
  win = new BrowserWindow({
    width: 1400,
		height: 768,
		show: false,
		darkTheme: true,
		backgroundColor: '#000000',
		icon: path.join(__dirname, '/../icon/512x512.png'),
    webPreferences: {
      nodeIntegration: true,
			nodeIntegrationInWorker: true,
			enableRemoteModule: true
    }
  });

	if (!gate_enabled){
		win.setMinimumSize(1366, 768);
		win.maximize();
	}

  if (gate_enabled && !debug_enabled){
		win.setKiosk(true);
  }

  win.loadFile(path.join(__dirname, '../public/index.html'))
  .then(() => {
		console.log('win then');
		listen_pcsc(win);

		if (gate_enabled){
			try {
				listen_mfrc(win, eStore);
				mqtt_gate(win);
			} catch (err) {
				console.log(err);
			}
		} else {
			try {
				mqtt_term(win);
			} catch (err) {
				console.log(err);
			}
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
	build_menu(win, eStore);
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

ipcMain.on('rebuild_menu', () => {
	build_menu(win, eStore);
});
