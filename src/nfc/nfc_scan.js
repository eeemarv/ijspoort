const env = window.require('electron').remote.process.env;
const { ipcRenderer } = window.require('electron');
import { reg_add_by_desk_auto } from '../db_put/reg_put';
import { reg_add_by_gate } from '../db_put/reg_put';
import { en_nfc } from '../services/enum';
import { ev_nfc_scan } from '../services/events';
import { reg_block_time } from '../db_put/reg_put';
import { sub_nfc_map } from '../services/sub';
import { sub_reg_nfc_auto_enabled } from '../services/sub';
import { sub_person_map } from '../services/sub';
import { sub_person_last_reg_ts_map } from '../services/sub';

const gate_enabled = env.GATE === '1';

// const dispatch = createEventDispatcher();

/*
export let nfc_status = en_nfc.OFF;
export let nfc_uid = undefined;
export let nfc_id = undefined;
*/

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
};

const listen_nfc = () => {
  ipcRenderer.on('nfc.on', (ev, card) => {
    const now = new Date();
    const ts_reg_fresh_after = now.getTime() - reg_block_time;
    const year_key = 'y' + now.getFullYear().toString();

    const nfc_uid = card.uid;

    /** not used 
    dispatch('nfc_on', {
      nfc_uid: nfc_uid
    });
    */

    const nfc_id = 'uid_' + nfc_uid;

    if (!sub_nfc_map.has(nfc_id)){

      ev_nfc_scan_dispatch('nfc_not_found', {nfc_uid});

      ipcRenderer.send('nfc.test_transport_key', nfc_uid);
      return;
    }

    // nfc_id = id;
    // review
    // selected_nfc_id.set(nfc_id);
    // review 
    // nfc_status = en_nfc.OK;

    ev_nfc_scan_dispatch('nfc_found', {nfc_id});

    const nfc = sub_nfc_map.get(nfc_id);

    if (!sub_person_map.has(nfc.person_id)){

      ev_nfc_scan_dispatch('person_not_found', {nfc_id});

      ipcRenderer.send('nfc.test_transport_key', nfc_uid);
      return;
    }

    const person_id = nfc.person_id;

    const person = sub_person_map.get(nfc.person_id);

    /** 
    console.log('dispatch scanned_person_found');

    dispatch('scanned_person_found', {
      person_id: person_id,
      person: person,
      nfc_uid: nfc_uid
    });

    */

    ev_nfc_scan_dispatch('person_found', {nfc_id});

    let is_member = false;

    if (typeof person.member_year === 'object'
      && person.member_year[year_key]){
      is_member = true;
    }

    if (!is_member){

      // 
      // selected_person_id.set(person_id);

      console.log('ev_nfc - not_member', nfc);

      /** 
      dispatch('scanned_person_not_member', {
        person_id: person_id,
        nfc_id: nfc_id,
        person: person,
        nfc_uid: nfc_uid
      });
      */

      ev_nfc_scan_dispatch('not_member', {nfc_id});

      return;
    }

    /**
     * 
    */

    /** valid member */


    // not here ... use events 
    /*
    if ($person_nfc_auto_enabled){
      selected_person_id.set(person_id);
    }
    */

    /** nfc tag blocked */

    if (typeof nfc.blocked !== 'undefined'){

      ev_nfc_scan_dispatch('blocked', {nfc_id});

      return;
    }

    /** register (if fresh) */

    if (!sub_person_last_reg_ts_map.has(person_id)
      || sub_person_last_reg_ts_map.get(person_id) < ts_reg_fresh_after){

      if (sub_reg_nfc_auto_enabled){
        reg_add_by_desk_auto(nfc_id);
      } else if (gate_enabled){
        reg_add_by_gate(nfc_id);
      }
    }
    else
    {
      ev_nfc_scan_dispatch('already_registered', {nfc_id});
      if (gate_enabled){
        ipcRenderer.send('gate.tx.already_registered', nfc_id);
      }
    }

    ev_nfc_scan_dispatch('valid_member', {nfc_id});

    /** desktop when selected person
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    **/ 
  });

  /******/

  ipcRenderer.on('nfc.test_transport_key.ok', (ev, card) => {
    console.log('nfc.test_transport_key.ok', card);
    nfc_status = en_nfc.TRANSPORT_KEY;

    ev_nfc_scan_dispatch('transport_key');
  });

  ipcRenderer.on('nfc.test_transport_key.fail', (ev, card) => {
    console.log('nfc.test_transport_key.fail', card);
    console.log('test for B key, nfc.test_b_key');
    ipcRenderer.send('nfc.test_b_key');

    ev_nfc_scan_dispatch('transport_key_fail');
  });

  ipcRenderer.on('nfc.test_a_key.ok', (ev) => {
    console.log('A key OK');
  });

  ipcRenderer.on('nfc.test_a_key.fail', (ev) => {
    console.log('A key FAIL');
  });

  ipcRenderer.on('nfc.test_b_key.ok', (ev) => {
    console.log('nfc.test_b_key.ok');
    // nfc_status = en_nfc.WRITABLE;


    ev_nfc_scan_dispatch('writable');
  });

  ipcRenderer.on('nfc.test_b_key.fail', (ev) => {
    console.log('nfc.test_b_key.fail');
    //  nfc_status = en_nfc.NOT_WRITABLE;

    ev_nfc_scan_dispatch('not_writable');
  });

  /*******/

  ipcRenderer.on('nfc.off', (ev) => {
    ev_nfc_scan_dispatch('off');

    /**
    nfc_uid = undefined;
    nfc_status = en_nfc.OFF;
    selected_nfc_id.set(undefined);
    dispatch('nfc_off');
    */
  });
};

export { listen_nfc };