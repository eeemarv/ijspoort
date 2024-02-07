const env = window.require('electron').remote.process.env;
const { ipcRenderer } = window.require('electron');
import { reg_add_by_desk_auto } from '../db_put/reg_put';
import { reg_add_by_gate } from '../db_put/reg_put';
import { ev_nfc_scan } from '../services/events';
import { sub_nfc_map } from '../services/sub';
import { sub_person_nfc_auto_enabled } from '../services/sub';
import { sub_reg_nfc_auto_enabled } from '../services/sub';
import { sub_person_map } from '../services/sub';
import { selected_person_id } from '../services/store';
import { selected_nfc_id } from '../services/store';
import { person_is_member_this_year } from '../person/person_member';
import { person_is_already_registered } from '../person/person_already_registered';

const gate_modus = env.GATE === '1';

/**
 * @param {string} nfc_id 
 * @returns {string}
 */
const nfc_id_to_uid = (nfc_id) => {
  return nfc_id.substring(4);
};

/**
 * @param {string} nfc_uid 
 * @returns {string}
 */
const nfc_uid_to_id = (nfc_uid) => {
  return 'uid_' + nfc_uid;
};

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
    const msg = detail.nfc_id ?? detail.nfc_uid ?? '';
    console.log('ipcRenderer.send scan.' + name + ' ' + msg);
    ipcRenderer.send('scan.' + name, msg);    
  }
};

/**
 * @returns {undefined}
 */
const listen_nfc = () => {
  ipcRenderer.on('nfc.on', (ev, {nfc_uid}) => {

    if (typeof nfc_uid !== 'string'){
      console.log('nfc_uid is not string', nfc_uid);
      return;
    }

    const nfc_id = nfc_uid_to_id(nfc_uid);
    selected_nfc_id.set(nfc_id);

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

    if (!person_is_member_this_year(person_id)){
      selected_person_id.set(person_id);
      ev_nfc_scan_dispatch('person_not_member', {nfc_id});
      return;
    }

    if (typeof nfc.blocked !== 'undefined'){
      selected_person_id.set(person_id);
      ev_nfc_scan_dispatch('nfc_blocked', {nfc_id});
      return;
    }

    /** register (if fresh) */

    if (person_is_already_registered(person_id)){
      ev_nfc_scan_dispatch('person_already_registered', {nfc_id});
    } else {
      if (gate_modus){
        reg_add_by_gate(nfc_id);        
      } else if (sub_reg_nfc_auto_enabled){
        reg_add_by_desk_auto(nfc_id);
      }
    }

    ev_nfc_scan_dispatch('person_valid_member', {nfc_id});

    if (sub_person_nfc_auto_enabled){
      selected_person_id.set(person_id);
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
    selected_nfc_id.set(undefined);
  });
};

export { nfc_id_to_uid };
export { nfc_uid_to_id };
export { listen_nfc };