const { ipcRenderer } = window.require('electron');
import { sub_gate_member_open_time } from '../services/sub';

const send_gate_open_once_with_timer = () => {
  console.log('send -> gate.open_once_with_timer');
  ipcRenderer.send('gate.open_once_with_timer', sub_gate_member_open_time)
};

const send_gate_open = () => {
  console.log('send -> gate.open');
  ipcRenderer.send('gate.open', {});
};

const send_gate_close = () => {
  console.log('send -> gate.close');
  ipcRenderer.send('gate.close', {});
};

export { send_gate_open };
export { send_gate_close };
export { send_gate_open_once_with_timer };