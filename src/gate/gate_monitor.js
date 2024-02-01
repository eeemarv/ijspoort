const { ipcRenderer } = window.require('electron');
import { gate_open } from '../services/store';

const listen_gate_open = () => {
  ipcRenderer.on('gate.is_open', (ev) => {
    gate_open.set(true);
  });

  ipcRenderer.on('gate.open.err', (ev) => {
    console.log('gate.open.err');
    gate_open.set(true);
  });

  ipcRenderer.on('gate.is_closed', (ev) => {
    gate_open.set(false);
  });

  ipcRenderer.on('gate.close.err', (ev) => {
    console.log('gate.close.err');
    gate_open.set(false);
  });
};

export { listen_gate_open };