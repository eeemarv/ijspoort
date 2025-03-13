import { ev_nfc_scan } from '../services/events';
import { gate_count } from '../services/store';
import { gate_count_enabled } from '../services/store';
import { members_only_enabled } from '../services/store';
import { sub_gate_count } from '../services/sub';
import { sub_gate_count_enabled } from '../services/sub';
import { sub_members_only_enabled } from '../services/sub';
import { gate_in_add } from '../db_put/gate_put';
import { gate_out_add } from '../db_put/gate_put';
import { send_gate_open } from './gate_command';
import { send_gate_close } from './gate_command';
import { send_gate_open_once_with_timer } from './gate_command';

/**
 * nfc_id that opened the gate
 */
let nfc_id = undefined;

const open_trigger = () => {
  if (sub_members_only_enabled){
    return;
  }
  if (sub_gate_count_enabled && (sub_gate_count <= 0)){
    return;
  }
  send_gate_open();
};

const close_trigger = () => {
  if (sub_members_only_enabled){
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

const listen_gate_triggers = () => {
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

  members_only_enabled.subscribe((b) => {
    if (b){
      close_trigger();
      return;
    }
    open_trigger();
  });

  window.bridge.onSensIn(() => {
    handle_sens_in();
  });

  window.bridge.onSensOut(() => {
    handle_sens_out();
  });

  ev_nfc_scan.addEventListener('gate_open_by_nfc', (e) => {
    /*
    if (sub_members_only_enabled){
      return;
    }
    */
    if (sub_gate_count_enabled && (sub_gate_count <= 0)){
      return;
    }
    nfc_id = e.detail.nfc_id;
    if (sub_members_only_enabled){
      send_gate_open_once_with_timer();
      return;
    }
    open_trigger();
  });
};

/**
 * @returns {string|undefined}
 */
const get_nfc_id_that_opened_gate = () => {
  return nfc_id;
};

export { handle_sens_in };
export { handle_sens_out };
export { listen_gate_triggers };
export { get_nfc_id_that_opened_gate };
