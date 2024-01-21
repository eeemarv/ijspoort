<script>
  const env = window.require('electron').remote.process.env;
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher } from 'svelte';

  import { selected_nfc_id } from '../services/store';
  import { selected_person_id } from '../services/store';
  import { person_nfc_auto_enabled } from '../services/store';
  import { reg_nfc_auto_enabled } from '../services/store';
  import { person_map } from '../services/store';
  import { person_last_reg_ts_map } from '../services/store';
  import { reg_add } from '../services/reg';
  import { reg_block_time } from '../services/store';
  import { nfc_map } from '../services/store';
  import { e_nfc } from '../services/enum';

  const gate_enabled = env.GATE === '1';

  const dispatch = createEventDispatcher();

  export let nfc_status = e_nfc.OFF;
  export let nfc_uid = undefined;
  export let nfc_id = undefined;

  ipcRenderer.on('nfc.on', (ev, card) => {
    const now = new Date();
    const ts_reg_fresh_after = now.getTime() - $reg_block_time;
    const year_key = 'y' + now.getFullYear().toString();

    nfc_uid = card.uid;

    /** not used 
    dispatch('nfc_on', {
      nfc_uid: nfc_uid
    });
    */

    const id = 'uid_' + nfc_uid;

    if (!$nfc_map.has(id)){

      console.log('dispatch scanned_uid_not_found');
      dispatch('scanned_uid_not_found', {
        nfc_uid: nfc_uid
      });

      ipcRenderer.send('nfc.test_transport_key');
      return;
    }

    nfc_id = id;
    $selected_nfc_id = id;
    nfc_status = e_nfc.OK;

    let nfc = $nfc_map.get(nfc_id);

    /** not used
    console.log('dispatch scanned_uid_found');
    dispatch('scanned_uid_found', {
      nfc_id: nfc_id,
      nfc: nfc,
      nfc_uid: nfc_uid
    });
    */

    if (!$person_map.has(nfc.person_id)){

      console.log('dispatch scanned_person_not_found');

      dispatch('scanned_person_not_found', {
        nfc_id: nfc_id,
        nfc_uid: nfc_uid
      });

      ipcRenderer.send('nfc.test_transport_key');
      return;
    }

    const person_id = nfc.person_id;

    let person = $person_map.get(nfc.person_id);

    /** not used
    console.log('dispatch scanned_person_found');

    dispatch('scanned_person_found', {
      person_id: person_id,
      person: person,
      nfc_uid: nfc_uid
    });
    */

    let is_member = false;

    if (typeof person.member_year === 'object'
      && person.member_year[year_key]){
      is_member = true;
    }

    if (!is_member){

      $selected_person_id = person_id;

      console.log('dispatch scanned_person_not_member');
      dispatch('scanned_person_not_member', {
        person_id: person_id,
        nfc_id: nfc_id,
        person: person,
        nfc_uid: nfc_uid
      });
      return;
    }

    /**
     * 
    */

    /** valid member */

    if ($person_nfc_auto_enabled){
      $selected_person_id = person_id;
    }

    /** nfc tag blocked */

    if (typeof nfc.blocked !== 'undefined'){
      console.log('Dispatch scanned_nfc_blocked', nfc);
      dispatch('scanned_nfc_blocked', {
        nfc_id: nfc_id,
        person_id: person_id
      });
      return;
    }

    /** register (if fresh) */

    if (!$person_last_reg_ts_map.has(person_id)
      || $person_last_reg_ts_map.get(person_id) < ts_reg_fresh_after){

      if ($reg_nfc_auto_enabled || gate_enabled){
        reg_add(person_id, nfc_uid);
      }

    }
    else
    {
      /**
       * review
      */
      console.log('dispatch scanned_person_already_registered');

      dispatch('scanned_person_already_registered', {
        person_id: person_id,
        nfc_id: nfc_id
      });
    }

    console.log('dispatch scanned_person_valid_member');

    dispatch('scanned_person_valid_member', {
      person_id: person_id,
      person: person,
      nfc_uid: nfc_uid
    });

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });

  /******/

  ipcRenderer.on('nfc.test_transport_key.ok', (ev, card) => {
    console.log('nfc.test_transport_key.ok', card);
    nfc_status = e_nfc.TRANSPORT_KEY;
  });

  ipcRenderer.on('nfc.test_transport_key.fail', (ev, card) => {
    console.log('nfc.test_transport_key.fail', card);
    console.log('test for B key, nfc.test_b_key');
    ipcRenderer.send('nfc.test_b_key');
  });

  ipcRenderer.on('nfc.test_a_key.ok', (ev) => {
    console.log('A key OK');
  });

  ipcRenderer.on('nfc.test_a_key.fail', (ev) => {
    console.log('A key FAIL');
  });

  ipcRenderer.on('nfc.test_b_key.ok', (ev) => {
    console.log('nfc.test_b_key.ok');
    nfc_status = e_nfc.WRITABLE;
  });

  ipcRenderer.on('nfc.test_b_key.fail', (ev) => {
    console.log('nfc.test_b_key.fail');
    nfc_status = e_nfc.NOT_WRITABLE;
  });

  /*******/

  ipcRenderer.on('nfc.off', (ev) => {
    nfc_uid = undefined;
    nfc_status = e_nfc.OFF;
    $selected_nfc_id = undefined;
    dispatch('nfc_off');
  });
</script>
