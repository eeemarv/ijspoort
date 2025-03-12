// const { ipcRenderer } = window.require('electron');
import { reg_add_by_desk_nfc } from '../db_put/reg_put';
import { reg_add_by_gate_nfc } from '../db_put/reg_put';
import { ev_nfc_scan } from '../services/events';
import { sub_member_period_select } from '../services/sub';
import { sub_nfc_map } from '../services/sub';
import { sub_desk_nfc_auto_open_person_data_enabled } from '../services/sub';
import { sub_desk_nfc_auto_reg_enabled } from '../services/sub';
import { sub_person_map } from '../services/sub';
import { desk_selected_person_id } from '../services/store';
import { desk_selected_nfc_id } from '../services/store';
import { person_is_member } from '../person/person_member';
import { nfc_uid_to_id } from './nfc_id';
import { nfc_block_others } from '../db_put/nfc_put';
import { get_ts_epoch } from '../services/functions';

let gate_flood_block_same_nfc_id = undefined;
let gate_flood_timeout_id = undefined;
const gate_flood_block_time = 3000;

/**
 * local
 * @param {string} name
 * @param {Object} detail
 */
const ev_nfc_scan_dispatch = (name, detail = {}) => {
  console.log('ev_nfc_scan - ' + name, detail);
  ev_nfc_scan.dispatchEvent(new CustomEvent(name, {detail}));
};

/**
 * @returns {undefined}
 */
const listen_nfc = () => {
  window.bridge.onNfcOn(({nfc_uid}) => {
    const ts_epoch = get_ts_epoch();

    if (typeof nfc_uid !== 'string'){
      console.log('nfc_uid is not string', nfc_uid);
      return;
    }

    const nfc_id = nfc_uid_to_id(nfc_uid);

    if (window.bridge.envKioskEnabled()){
      if (typeof gate_flood_block_same_nfc_id === 'string'
        && nfc_id === gate_flood_block_same_nfc_id){
        console.log('flood blocked scan same nfc_id ' + nfc_id);
        return;
      }

      clearTimeout(gate_flood_timeout_id);
      gate_flood_timeout_id = setTimeout(() => {
        gate_flood_block_same_nfc_id = undefined;
      }, gate_flood_block_time);
      gate_flood_block_same_nfc_id = nfc_id;
    }

    desk_selected_nfc_id.set(nfc_id);

    if (!sub_nfc_map.has(nfc_id)){
      ev_nfc_scan_dispatch('nfc_not_found', {nfc_id});
      if (!window.bridge.envKioskEnabled()){
        window.bridge.sendNfcTestTransportKey({nfc_uid});
      }
      return;
    }

    ev_nfc_scan_dispatch('nfc_found', {nfc_id});

    const nfc = sub_nfc_map.get(nfc_id);

    if (!sub_person_map.has(nfc.person_id)){
      ev_nfc_scan_dispatch('person_not_found', {nfc_id});
      if (!window.bridge.envKioskEnabled()){
        window.bridge.sendNfcTestTransportKey({nfc_uid});
      }
      return;
    }

    const person_id = nfc.person_id;
    let invalid_msg_sent = false;

    if (!person_is_member(person_id, sub_member_period_select)){
      desk_selected_person_id.set(person_id);
      ev_nfc_scan_dispatch('person_not_member', {nfc_id});
      invalid_msg_sent = true;
    }

    if (typeof nfc.blocked !== 'undefined'){
      desk_selected_person_id.set(person_id);
      if (!invalid_msg_sent){
        ev_nfc_scan_dispatch('nfc_blocked', {nfc_id});
      }

      // reg invalid.nfc_blocked
      invalid_msg_sent =  true;
    }

    if (window.bridge.envKioskEnabled()){
      const nfc_block_mixin = nfc_block_others(nfc_id, ts_epoch);
      reg_add_by_gate_nfc(nfc_id, ts_epoch, nfc_block_mixin);
    }

    if (sub_desk_nfc_auto_reg_enabled){
      reg_add_by_desk_nfc(nfc_id, ts_epoch);
    }

    if (!invalid_msg_sent){
      ev_nfc_scan_dispatch('person_valid_member', {nfc_id});
    }

    if (sub_desk_nfc_auto_open_person_data_enabled){
      desk_selected_person_id.set(person_id);
    }
  });

  window.bridge.onNfcTestTransportKeyOk(({nfc_uid}) => {
//  ipcRenderer.on('nfc.test_transport_key.ok', (ev, {nfc_uid}) => {
    console.log('nfc.test_transport_key.ok', nfc_uid);
    const nfc_id = nfc_uid_to_id(nfc_uid);

    ev_nfc_scan_dispatch('nfc_transport_key_ok', {nfc_id});
  });

  window.bridge.onNfcTestTransportKeyFail(({nfc_uid}) => {
//  ipcRenderer.on('nfc.test_transport_key.fail', (ev, {nfc_uid}) => {
    console.log('nfc.test_transport_key.fail', nfc_uid);
    console.log('test for B key, nfc.test_b_key');
//    ipcRenderer.send('nfc.test_b_key', {nfc_uid});
    window.bridge.sendNfcTestBKey({nfc_uid});
    const nfc_id = nfc_uid_to_id(nfc_uid);
    ev_nfc_scan_dispatch('nfc_transport_key_fail', {nfc_id});
  });

  window.bridge.onNfcTestAKeyOk(({nfc_uid}) => {
//  ipcRenderer.on('nfc.test_a_key.ok', (ev, {nfc_uid}) => {
    console.log('A key OK', nfc_uid);
  });

  window.bridge.onNfcTestAKeyFail(({nfc_uid}) => {
//  ipcRenderer.on('nfc.test_a_key.fail', (ev, {nfc_uid}) => {
    console.log('A key FAIL', nfc_uid);
  });

  window.bridge.onNfcTestBKeyOk(({nfc_uid}) => {
//  ipcRenderer.on('nfc.test_b_key.ok', (ev, {nfc_uid}) => {
    console.log('nfc.test_b_key.ok', nfc_uid);
    const nfc_id = nfc_uid_to_id(nfc_uid);
    ev_nfc_scan_dispatch('nfc_writable', {nfc_id});
  });

  window.bridge.onNfcTestBKeyFail(({nfc_uid}) => {
//  ipcRenderer.on('nfc.test_b_key.fail', (ev, {nfc_uid}) => {
    console.log('nfc.test_b_key.fail', nfc_uid);
    const nfc_id = nfc_uid_to_id(nfc_uid);
    ev_nfc_scan_dispatch('nfc_not_writable', {nfc_id});
  });

  window.bridge.onNfcOff(() => {
    ev_nfc_scan_dispatch('nfc_off');
    desk_selected_nfc_id.set(undefined);
  });
};

export { listen_nfc };