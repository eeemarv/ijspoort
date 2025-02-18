require('dotenv').config();
const { shell } = require('electron');
const { contextBridge, ipcRenderer } = require('electron/renderer');
const { e_store_get, e_store_set } = require('./../main/e_store');
const XLSX = require('xlsx');
const env = process.env;

console.log('PRELOAD PRELOAD PRELOAD');

contextBridge.exposeInMainWorld('bridge', {
  openGithubRepo: () => shell.openExternal('https://github.com/eeemarv/ijspoort'),
  openAssist: () => shell.openExternal('https://assistonline.eu'),

  getEnvDbUrl: () => env.DB_URL,
  getEnvDbUsername: () => env.DB_USERNAME,
  getEnvDbPassword: () => env.DB_PASSWORD,
  getEnvDbPrefix: () => env.DB_PREFIX,
  getEnvDbLocalPrefix: () => env.DB_LOCAL_PREFIX,
  getEnvDbRemotePrefix: () => env.DB_REMOTE_PREFIX,
  getEnvKioskAuth: () => env.GATE_AUTH,
  envKioskEnabled: () => env.GATE === '1',
  envDebugEnabled: () => env.DEBUG === '1',
  envEmulateSensEnabled: () => env.EMULATE_SENS === '1',

  getFromStore: (key, default_value) => e_store_get(key, default_value),
  setToStore: (key, value) => e_store_set(key, value),

  onMenuMembersImport: (callback) => ipcRenderer.on('menu.members.import', () => callback()),
  onMenuMembersRemove: (callback) => ipcRenderer.on('menu.members.remove', () => callback()),
  onMenuMembersCleanup: (callback) => ipcRenderer.on('menu.members.cleanup', () => callback()),

  onMenuRegCsvExport: (callback) => ipcRenderer.on('menu.reg.csv.export', () => callback()),
  onMenuRegCountCsvExport: (callback) => ipcRenderer.on('menu.reg.count.csv.export', () => callback()),
  onMenuPersonRegCountCsvExport: (callback) => ipcRenderer.on('menu.person.reg.count.csv.export', () => callback()),
  onMenuDbJsonExport: (callback) => ipcRenderer.on('menu.db.json.export', () => callback()),

  onMenuOpenConfig: (callback) => ipcRenderer.on('menu.open_config', () => callback()),

  onWaterTemp: (callback) => ipcRenderer.on('water_temp', (ev, value) => callback(value)),
  onAirTemp: (callback) => ipcRenderer.on('air_temp', (ev, value) => callback(value)),

  sendNfcReset: (data) => ipcRenderer.send('nfc.reset', data),
  onNfcResetOk: (callback) => ipcRenderer.on('nfc.reset.ok', (ev, data) => callback(data)),
  onNfcResetFail: (callback) => ipcRenderer.on('nfc.reset.fail', (ev, data) => callback(data)),
  sendNfcRead: (data) => ipcRenderer.send('nfc.read', data),
  onNfcReadOk: (callback) => ipcRenderer.on('nfc.read.ok', (ev, data) => callback(data)),
  onNfcReadFail: (callback) => ipcRenderer.on('nfc.read.fail', (ev, data) => callback(data)),
  sendNfcInit: (data) => ipcRenderer.send('nfc.init', data),
  onNfcInitOk: (callback) => ipcRenderer.on('nfc.init.ok', (ev, data) => callback(data)),
  onNfcInitFail: (callback) => ipcRenderer.on('nfc.init.fail', (ev, data) => callback(data)),

  sendGateOpen: () => ipcRenderer.send('gate.open', {}),
  sendGateClose: () => ipcRenderer.send('gate.close', {}),
  sendGateOpenOnceWithTimer: (seconds) => ipcRenderer.send('gate.open_once_with_timer', seconds),
  onGateIsOpen: (callback) => ipcRenderer.on('gate.is_open', (ev) => callback()),
  onGateOpenErr: (callback) => ipcRenderer.on('gate.open.err', (ev) => callback()),
  onGateIsClosed: (callback) => ipcRenderer.on('gate.is_closed', (ev) => callback()),
  onGateCloseErr: (callback) => ipcRenderer.on('gate.close.err', (ev) => callback()),

  onSensIn: (callback) => ipcRenderer.on('sens.in', (ev) => callback()),
  onSensOut: (callback) => ipcRenderer.on('sens.out', (ev) => callback()),

  sendScanGateWait: (nfc_id) => ipcRenderer.send('scan.gate.wait', nfc_id),
  sendScanGateFull: (nfc_id) => ipcRenderer.send('scan.gate.full', nfc_id),
  sendScanGatePersonValidMember: (nfc_id) => ipcRenderer.send('scan.gate.person_valid_member', nfc_id),
  sendScanGatePersonNotMember: (nfc_id) => ipcRenderer.send('scan.gate.person_not_member', nfc_id),
  sendScanGatePersonNotFound: (nfc_id) => ipcRenderer.send('scan.gate.person_not_found', nfc_id),
  sendScanGateNfcNotFound: (nfc_id) => ipcRenderer.send('scan.gate.nfc_not_found', nfc_id),
  sendScanGateNfcBlocked: (nfc_id) => ipcRenderer.send('scan.gate.nfc_blocked', nfc_id),

  onDevNfcOn: (callback) => ipcRenderer.on('dev.nfc.on', (ev) => callback()),
  onDevNfcOff: (callback) => ipcRenderer.on('dev.nfc.off', (ev) => callback()),
  onDevNfcError: (callback) => ipcRenderer.on('dev.nfc.error', (ev) => callback()),

  onNfcOn: (callback) => ipcRenderer.on('nfc.on', (ev, data) => callback(data)),
  onNfcOff: (callback) => ipcRenderer.on('nfc.off', (ev) => callback()),
  sendNfcTestTransportKey: (data) => ipcRenderer.send('nfc.test_transport_key', data),
  onNfcTestTransportKeyOk: (callback) => ipcRenderer.on('nfc.test_transport_key.ok', (ev, data) => callback(data)),
  onNfcTestTransportKeyFail: (callback) => ipcRenderer.on('nfc.test_transport_key.fail', (ev, data) => callback(data)),
  onNfcTestAKeyOk: (callback) => ipcRenderer.on('nfc.test_a_key.ok', (ev, data) => callback(data)),
  sendNfcTestBKey: (data) => ipcRenderer.send('nfc.test_b_key', data),
  onNfcTestAKeyFail: (callback) => ipcRenderer.on('nfc.test_a_key.fail', (ev, data) => callback(data)),
  onNfcTestBKeyOk: (callback) => ipcRenderer.on('nfc.test_b_key.ok', (ev, data) => callback(data)),
  onNfcTestBKeyFail: (callback) => ipcRenderer.on('nfc.test_b_key.fail', (ev, data) => callback(data)),

  sendScanValidMember: (nfc_id) => ipcRenderer.send('scan.person_valid_member', nfc_id),
  sendScanNfcNotFound: (nfc_id) => ipcRenderer.send('scan.nfc_not_found', nfc_id),
  sendScanNfcBlocked: (nfc_id) => ipcRenderer.send('scan.nfc_blocked', nfc_id),
  sendScanPersonNotFound: (nfc_id) => ipcRenderer.send('scan.person_not_found', nfc_id),
  sendScanPersonNotMember: (nfc_id) => ipcRenderer.send('scan.person_not_member', nfc_id),

  onScanGateWait: (callback) => ipcRenderer.on('scan.gate.wait', (ev, nfc_id) => callback(nfc_id)),
  onScanGateFull: (callback) => ipcRenderer.on('scan.gate.full', (ev, nfc_id) => callback(nfc_id)),
  onScanGatePersonValidMember: (callback) => ipcRenderer.on('scan.gate.person_valid_member', (ev, nfc_id) => callback(nfc_id)),
  onScanGatePersonNotMember: (callback) => ipcRenderer.on('scan.gate.person_not_member', (ev, nfc_id) => callback(nfc_id)),
  onScanGatePersonNotFound: (callback) => ipcRenderer.on('scan.gate.person_not_found', (ev, nfc_id) => callback(nfc_id)),
  onScanGateNfcNotFound: (callback) => ipcRenderer.on('scan.gate.nfc_not_found', (ev, nfc_id) => callback(nfc_id)),
  onScanGateNfcBlocked: (callback) => ipcRenderer.on('scan.gate.nfc_blocked', (ev, nfc_id) => callback(nfc_id)),

  onImportFileSelected: (callback) => ipcRenderer.on('import_file.selected', (ev, selected_file_path) => callback(selected_file_path)),
  sendImportFileSelect: () => ipcRenderer.send('import_file.select'),

  getJsonFromXlsxFile: (file) => {
    const workbook = XLSX.readFile(file);
    const sheet_name_list = workbook.SheetNames;
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: '', raw: false});
  }
});
