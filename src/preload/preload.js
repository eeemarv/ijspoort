import 'dotenv/config';
import { shell } from 'electron';
import { contextBridge, ipcRenderer } from 'electron/renderer';
import { e_store_get, e_store_set } from './../main/e_store';
const env = process.env;

console.log('+++ PRELOAD +++');

contextBridge.exposeInMainWorld('bridge', {
  openGithubRepo: () => shell.openExternal('https://github.com/eeemarv/ijspoort'),
  openAssist: () => shell.openExternal('https://assistonline.eu'),

  getEnvDbUrl: () => env.DB_URL,
  getEnvDbUsername: () => env.DB_USERNAME,
  getEnvDbPassword: () => env.DB_PASSWORD,
  getEnvDbPrefix: () => env.DB_PREFIX,
  getEnvDbLocalPrefix: () => env.DB_LOCAL_PREFIX,
  getEnvDbRemotePrefix: () => env.DB_REMOTE_PREFIX,
  getEnvKioskAuth: () => env.KIOSK_AUTH || env.GATE_AUTH,
  envKioskEnabled: () => env.KIOSK === '1' || env.GATE === '1',
  envDebugEnabled: () => env.DEBUG === '1',
  envEmulateSensEnabled: () => env.EMULATE_SENS === '1',

  getFromStore: (key, default_value) => e_store_get(key, default_value),
  setToStore: (key, value) => e_store_set(key, value),

  /** menu for Desk */
  onMenuMembersImport: (callback) => ipcRenderer.on('menu.members.import', () => callback()),
  onMenuMembersRemove: (callback) => ipcRenderer.on('menu.members.remove', () => callback()),
  onMenuMembersCleanup: (callback) => ipcRenderer.on('menu.members.cleanup', () => callback()),

  onMenuRegCsvExport: (callback) => ipcRenderer.on('menu.reg.csv.export', () => callback()),
  onMenuRegCountCsvExport: (callback) => ipcRenderer.on('menu.reg.count.csv.export', () => callback()),
  onMenuPersonRegCountCsvExport: (callback) => ipcRenderer.on('menu.person.reg.count.csv.export', () => callback()),
  onMenuDbJsonExport: (callback) => ipcRenderer.on('menu.db.json.export', () => callback()),

  onMenuOpenConfig: (callback) => ipcRenderer.on('menu.open_config', () => callback()),

  /** for Desk and Kiosk from temperature sensors */
  onWaterTemp: (callback) => ipcRenderer.on('water_temp', (ev, value) => callback(value)),
  onAirTemp: (callback) => ipcRenderer.on('air_temp', (ev, value) => callback(value)),

  /** NFC Desk to main */

  invokeNfcWrite: (data) => ipcRenderer.invoke('nfc.write', data),
  invokeNfcRead: (data) => ipcRenderer.invoke('nfc.read', data),
  invokeNfcReset: (data) => ipcRenderer.invoke('nfc.reset', data),
  invokeNfcTestB: (data) => ipcRenderer.invoke('nfc.test_b', data),
  invokeNfcTestTransport: (data) => ipcRenderer.invoke('nfc.test_transport', data),

  /** from Kiosk to Gate Interface */
  sendGateOpen: () => ipcRenderer.send('gate.open', {}),
  sendGateClose: () => ipcRenderer.send('gate.close', {}),
  sendGateOpenOnceWithTimer: (seconds) => ipcRenderer.send('gate.open_once_with_timer', seconds),

  /** from Gate interface to Desk and Kiosk */
  onGateIsOpen: (callback) => ipcRenderer.on('gate.is_open', (ev) => callback()),
  onGateOpenErr: (callback) => ipcRenderer.on('gate.open.err', (ev) => callback()),
  onGateIsClosed: (callback) => ipcRenderer.on('gate.is_closed', (ev) => callback()),
  onGateCloseErr: (callback) => ipcRenderer.on('gate.close.err', (ev) => callback()),

  onSensIn: (callback) => ipcRenderer.on('sens.in', (ev) => callback()),
  onSensOut: (callback) => ipcRenderer.on('sens.out', (ev) => callback()),

  /** from Kiosk to mqtt (to Desk) */
  sendScanGateWait: (nfc_id) => ipcRenderer.send('scan.gate.wait', nfc_id),
  sendScanGateFull: (nfc_id) => ipcRenderer.send('scan.gate.full', nfc_id),
  sendScanGatePersonValidMember: (nfc_id) => ipcRenderer.send('scan.gate.person_valid_member', nfc_id),
  sendScanGatePersonNotMember: (nfc_id) => ipcRenderer.send('scan.gate.person_not_member', nfc_id),
  sendScanGatePersonNotFound: (nfc_id) => ipcRenderer.send('scan.gate.person_not_found', nfc_id),
  sendScanGateNfcNotFound: (nfc_id) => ipcRenderer.send('scan.gate.nfc_not_found', nfc_id),
  sendScanGateNfcBlocked: (nfc_id) => ipcRenderer.send('scan.gate.nfc_blocked', nfc_id),

  /** for Desk and Kiosk from main process */
  onDevNfcOn: (callback) => ipcRenderer.on('dev.nfc.on', (ev) => callback()),
  onDevNfcOff: (callback) => ipcRenderer.on('dev.nfc.off', (ev) => callback()),
  onDevNfcError: (callback) => ipcRenderer.on('dev.nfc.error', (ev) => callback()),
  onDevNfcSpeed: (callback) => ipcRenderer.on('dev.nfc.speed', (ev, speed) => callback(speed)),

  onNfcOn: (callback) => ipcRenderer.on('nfc.on', (ev, data) => callback(data)),
  onNfcOff: (callback) => ipcRenderer.on('nfc.off', (ev) => callback()),

  /** from mqtt (Kiosk) to Desk */
  onScanGateWait: (callback) => ipcRenderer.on('scan.gate.wait', (ev, nfc_id) => callback(nfc_id)),
  onScanGateFull: (callback) => ipcRenderer.on('scan.gate.full', (ev, nfc_id) => callback(nfc_id)),
  onScanGatePersonValidMember: (callback) => ipcRenderer.on('scan.gate.person_valid_member', (ev, nfc_id) => callback(nfc_id)),
  onScanGatePersonNotMember: (callback) => ipcRenderer.on('scan.gate.person_not_member', (ev, nfc_id) => callback(nfc_id)),
  onScanGatePersonNotFound: (callback) => ipcRenderer.on('scan.gate.person_not_found', (ev, nfc_id) => callback(nfc_id)),
  onScanGateNfcNotFound: (callback) => ipcRenderer.on('scan.gate.nfc_not_found', (ev, nfc_id) => callback(nfc_id)),
  onScanGateNfcBlocked: (callback) => ipcRenderer.on('scan.gate.nfc_blocked', (ev, nfc_id) => callback(nfc_id)),

  /** file for Assist import */
  invokeAssistFileSelect: () => ipcRenderer.invoke('assist_file.select'),
  invokeAssistFileJson: (file) => ipcRenderer.invoke('assist_file.get_json', file),
});
