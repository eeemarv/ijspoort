const { ipcRenderer } = window.require('electron');
import { ev_nfc_scan } from '../services/events';
import { ev_gate } from '../services/events';
import { gate_count } from '../services/store';
import { gate_count_enabled } from '../services/store';
import { gate_nfc_enabled } from '../services/store';
import { sub_gate_count } from '../services/sub';
import { sub_gate_count_enabled } from '../services/sub';
import { sub_gate_nfc_enabled } from '../services/sub';
import { gate_in_add } from '../db_put/gate_put';
import { gate_out_add } from '../db_put/gate_put';
import { send_gate_open } from './gate_monitor';
import { send_gate_close } from './gate_monitor';
import { send_gate_open_once_with_timer } from './gate_monitor';

export const open_trigger = () => {
  if (sub_gate_nfc_enabled){
    return;
  }
  if (sub_gate_count_enabled && (sub_gate_count <= 0)){
    return;
  }
  send_gate_open();
};

export const close_trigger = () => {
  if (sub_gate_nfc_enabled){
    send_gate_close();
    return;
  }
  if (sub_gate_count_enabled && (sub_gate_count <= 0)){
    send_gate_close();
    return;
  }
};

const handle_sens_in = () => {
  if (sub_gate_count_enabled){
    gate_count.dec();
  }
  gate_in_add(nfc_id);
  nfc_id = undefined;
  close_trigger();
};

const handle_sens_out = () => {
  if (sub_gate_count_enabled){
    gate_count.inc();
  }
  gate_out_add();
};

const listen_gate = () => {
  gate_count.subscribe((c) => {
    if (c > 0){
      open_trigger();
      return;
    }
    close_trigger();
  });

  gate_count_enabled.subscribe((b) => {
    if (b){
      close_trigger();
      return;
    }
    open_trigger();
  });

  gate_nfc_enabled.subscribe((b) => {
    if (b){
      close_trigger();
      return;
    }
    open_trigger();
  });

  ipcRenderer.on('sens.in', (ev) => {
    ev_gate.dispatchEvent(new Event('sens_in'));
  });

  ipcRenderer.on('sens.out', (ev) => {
    ev_gate.dispatchEvent(new Event('sens_out'));
  });
};

const listen_nfc_scan = () => {
  ev_nfc_scan.addEventListener('nfc_not_found', (e) => {

  });

  ev_nfc_scan.addEventListener('nfc_found', (e) => {
    // not used
  });

  ev_nfc_scan.addEventListener('person_not_found', (e) => {
    //
  });

  ev_nfc_scan.addEventListener('person_found', (e) => {
    // not used
  });

  ev_nfc_scan.addEventListener('not_member', (e) => {

  });

  ev_nfc_scan.addEventListener('blocked', (e) => {

  });

  ev_nfc_scan.addEventListener('valid_member', (e) => {

  });
};

export { gate_open };
export { handle_sens_in };
export { handle_sens_out };
export { listen_gate };
export { listen_nfc_scan };