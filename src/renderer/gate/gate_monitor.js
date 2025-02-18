// const { ipcRenderer } = window.require('electron');
import { gate_open } from '../services/store';

const listen_gate_open = () => {
  window.bridge.onGateIsOpen(() => {
    gate_open.set(true);
  });

  window.bridge.onGateOpenErr(() => {
    console.log('gate.open.err');
    gate_open.set(true);
  });

  window.bridge.onGateIsClosed(() => {
    gate_open.set(false);
  });

  window.bridge.onGateCloseErr(() => {
    console.log('gate.close.err');
    gate_open.set(false);
  });
};

export { listen_gate_open };