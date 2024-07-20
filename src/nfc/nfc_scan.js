const env = window.require('electron').remote.process.env;
const { ipcRenderer } = window.require('electron');
import { reg_add_by_desk_nfc } from '../db_put/reg_put';
import { reg_add_by_gate_nfc } from '../db_put/reg_put';
import { ev_nfc_scan } from '../services/events';
import { sub_desk_member_period_filter } from '../services/sub';
import { sub_member_period_select } from '../services/sub';
import { sub_nfc_map } from '../services/sub';
import { sub_gate_nfc_auto_block_enabled } from '../services/sub';
import { sub_desk_nfc_auto_open_person_data_enabled } from '../services/sub';
import { sub_desk_nfc_auto_reg_enabled } from '../services/sub';
import { sub_person_map } from '../services/sub';
import { desk_selected_person_id } from '../services/store';
import { desk_selected_nfc_id } from '../services/store';
import { person_is_member } from '../person/person_member';
import { person_is_already_registered } from '../person/person_already_registered';
import { nfc_uid_to_id } from './nfc_id';
import { nfc_block_others } from '../db_put/nfc_put';
import { get_ts_epoch } from '../services/functions';

const gate_modus = env.GATE === '1';

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
  ev_nfc_scan.dispatchEvent(new CustomEvent(name, {
    detail: detail
  }));
  if (gate_modus){
    const msg = detail.nfc_id ?? '';
    console.log('ipcRenderer.send scan.' + name + ' ' + msg);
    ipcRenderer.send('scan.' + name, msg);
  }
};

/**
 * @returns {undefined}
 */
const listen_nfc = () => {
  ipcRenderer.on('nfc.on', (ev, {nfc_uid}) => {
    const ts_epoch = get_ts_epoch();

    if (typeof nfc_uid !== 'string'){
      console.log('nfc_uid is not string', nfc_uid);
      return;
    }

    const nfc_id = nfc_uid_to_id(nfc_uid);

    if (gate_modus){
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
      ipcRenderer.send('nfc.test_transport_key', {nfc_uid});
      return;
    }

    ev_nfc_scan_dispatch('nfc_found', {nfc_id});

    const nfc = sub_nfc_map.get(nfc_id);

    if (!sub_person_map.has(nfc.person_id)){
      ev_nfc_scan_dispatch('person_not_found', {nfc_id});
      ipcRenderer.send('nfc.test_transport_key', {nfc_uid});
      return;
    }

    const person_id = nfc.person_id;

    ev_nfc_scan_dispatch('person_found', {nfc_id});

    const member_period = gate_modus ? sub_member_period_select : sub_desk_member_period_filter;

    if (!person_is_member(person_id, member_period)){
      desk_selected_person_id.set(person_id);
      ev_nfc_scan_dispatch('person_not_member', {nfc_id});
      // reg invalid.not_member_in
      return;
    }

    if (typeof nfc.blocked !== 'undefined'){
      desk_selected_person_id.set(person_id);
      ev_nfc_scan_dispatch('nfc_blocked', {nfc_id});
      // reg invalid.nfc_blocked
      return;
    }

    // gate modus: auto block

    // person_member

    // reg.invalid.not_fresh
    // reg ... valid

    /** register (if fresh) */

    /** in gate modus, with auto block enabled check if blocks apply */
    let nfc_block_mixin = {};

    if (gate_modus && sub_gate_nfc_auto_block_enabled){
      nfc_block_mixin = nfc_block_others(nfc_id, ts_epoch);
    };

    if (person_is_already_registered(person_id)){
      ev_nfc_scan_dispatch('person_already_registered', {nfc_id});

      if (gate_modus){
        if (Object.keys(nfc_block_mixin).length){
          /** add a registration anyway when a nfc tag got blocked */
          reg_add_by_gate_nfc(nfc_id, ts_epoch, nfc_block_mixin);
        }
      }
    } else {
      if (gate_modus){
        reg_add_by_gate_nfc(nfc_id, ts_epoch, nfc_block_mixin);
      } else if (sub_desk_nfc_auto_reg_enabled){
        reg_add_by_desk_nfc(nfc_id, ts_epoch);
      }
    }

    ev_nfc_scan_dispatch('person_valid_member', {nfc_id});

    if (sub_desk_nfc_auto_open_person_data_enabled){
      desk_selected_person_id.set(person_id);
    }
  });

  ipcRenderer.on('nfc.test_transport_key.ok', (ev, {nfc_uid}) => {
    console.log('nfc.test_transport_key.ok', nfc_uid);
    const nfc_id = nfc_uid_to_id(nfc_uid);

    ev_nfc_scan_dispatch('nfc_transport_key_ok', {nfc_id});
  });

  ipcRenderer.on('nfc.test_transport_key.fail', (ev, {nfc_uid}) => {
    console.log('nfc.test_transport_key.fail', nfc_uid);
    console.log('test for B key, nfc.test_b_key');
    ipcRenderer.send('nfc.test_b_key', {nfc_uid});
    const nfc_id = nfc_uid_to_id(nfc_uid);
    ev_nfc_scan_dispatch('nfc_transport_key_fail', {nfc_id});
  });

  ipcRenderer.on('nfc.test_a_key.ok', (ev, {nfc_uid}) => {
    console.log('A key OK', nfc_uid);
  });

  ipcRenderer.on('nfc.test_a_key.fail', (ev, {nfc_uid}) => {
    console.log('A key FAIL', nfc_uid);
  });

  ipcRenderer.on('nfc.test_b_key.ok', (ev, {nfc_uid}) => {
    console.log('nfc.test_b_key.ok', nfc_uid);
    const nfc_id = nfc_uid_to_id(nfc_uid);
    ev_nfc_scan_dispatch('nfc_writable', {nfc_id});
  });

  ipcRenderer.on('nfc.test_b_key.fail', (ev, {nfc_uid}) => {
    console.log('nfc.test_b_key.fail', nfc_uid);
    const nfc_id = nfc_uid_to_id(nfc_uid);
    ev_nfc_scan_dispatch('nfc_not_writable', {nfc_id});
  });

  ipcRenderer.on('nfc.off', (ev) => {
    ev_nfc_scan_dispatch('nfc_off');
    desk_selected_nfc_id.set(undefined);
  });
};

export { listen_nfc };