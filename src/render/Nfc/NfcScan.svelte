<script>
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher } from 'svelte';
  import { db_nfc, db_person } from '../services/db';
  import { nfc_uid } from '../services/store';

  const dispatch = createEventDispatcher();

  export let nfc_status = 'off';

  ipcRenderer.on('nfc.on', (ev, card) => {
    $nfc_uid = card.uid;
    let blocked = false;
    let year_key = 'y' + (new Date()).getFullYear().toString();

    dispatch('nfc_on', {
      nfc_uid: $nfc_uid
    });

    db_nfc.get('uid_'+ card.uid).then((res) => {
      console.log('db_nfc.get');
      console.log(res);
      nfc_status = 'ok';

      console.log('dispatch scanned_uid_found');
      dispatch('scanned_uid_found', {
        nfc: res,
        nfc_uid: $nfc_uid
      });

      return res;
    }).catch((err) => {
      if (err.name === 'not_found'){

        console.log('dispatch scanned_uid_not_found');
        dispatch('scanned_uid_not_found', {
          nfc_uid: $nfc_uid
        });

        ipcRenderer.send('nfc.test_transport_key');
        throw 'nfc uid not found in database (check if transport key is set)';
      }
      throw err;
    }).then((res) => {
      if (typeof res.blocked === 'object'){
        let last_block_item = res.blocked[res.blocked.length - 1];
        if (last_block_item.blocked){
          blocked = true;
        }
      }
      return db_person.get(res.person_id);
    }).catch((err) => {
      console.log(err);
      if (err.name === 'not_found'){

        console.log('dispatch scanned_person_not_found');
        dispatch('scanned_person_not_found', {
          nfc_uid: $nfc_uid
        });

        ipcRenderer.send('nfc.test_transport_key');
        throw 'person was not found';
      }
      throw err;
    }).then((res) => {

      console.log('dispatch scanned_person_found');
      dispatch('scanned_person_found', {
        person: res,
        nfc_uid: $nfc_uid
      });

      let is_member = false;
      if (typeof res.member_year === 'object'
        && res.member_year[year_key]){
        is_member = true;
      }

      if (!is_member){
        console.log('dispatch scanned_person_not_member');
        dispatch('scanned_person_not_member', {
          person: res,
          nfc_uid: $nfc_uid
        });
        return;
      }

      if (blocked){
        console.log('dispatch scanned_uid_blocked');
        dispatch('scanned_uid_blocked', {
          person: res,
          nfc_uid: $nfc_uid
        });
        return;
      }

      console.log('dispatch scanned_person_valid_member');
      dispatch('scanned_person_valid_member', {
        person: res,
        nfc_uid: $nfc_uid
      });

    }).catch((err) => {
      console.log(err);
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
    nfc_status = 'transport_key';
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
    nfc_status = 'writable';
  });

  ipcRenderer.on('nfc.test_b_key.fail', (ev) => {
    console.log('nfc.test_b_key.fail');
    nfc_status = 'not_writable';
  });

  /*******/

  ipcRenderer.on('nfc.off', (ev) => {
    $nfc_uid = undefined;
    nfc_status = 'off';
    dispatch('nfc_off');
  });
</script>
