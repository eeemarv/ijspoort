<script>
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher } from 'svelte';
  import { Button, CardFooter } from 'sveltestrap';
  import { db_nfc } from '../services/db';
  import { person, person_nfc_list } from '../services/store';
  import { nfc_uid } from '../services/store';
  import NfcModal from './NfcModal.svelte';

  export let nfc_status;
  let nfc_modal;

  const dispatch = createEventDispatcher();

  $: can_activate = $person && $nfc_uid && nfc_status === 'transport_key';

  const handle_activate_nfc = () => {
    console.log('handle_activate_nfc');
    nfc_modal.start('Schrijf sleutels');
    console.log('send nfc.init');
    ipcRenderer.send('nfc.init', $person);
  };

  ipcRenderer.on('nfc.init.ok', (ev, card) => {
    add_nfc();
    nfc_modal.stop_timeout('Initialisatie ok.', 100, 1000);
  });

  ipcRenderer.on('nfc.init.fail', (ev, card) => {
    nfc_modal.stop_timeout('Initialisatie niet gelukt.', 20, 5000);
  });

  const add_nfc = () => {
    let now = new Date();
    let nfc = {
      _id: 'uid_' + $nfc_uid,
      ts_epoch: now.getTime(),
      uid: $nfc_uid,
      person_id: $person._id
    };

    db_nfc.put(nfc).then((res) => {
      console.log('add_nfc');
      console.log(res);
      dispatch('activated', {});
    }).catch((err) => {
      console.log(err);
    });
  };
</script>

<NfcModal bind:this={nfc_modal} title="Activeer NFC tag" />

<CardFooter class="d-flex w-100 justify-content-end">
  <Button
    color={$person_nfc_list.length > 0 ? 'danger' : 'success'}
    title="Activeer deze NFC-tag voor deze persoon"
    disabled={!can_activate}
    on:click={handle_activate_nfc}>
    Activeer
    {#if $person_nfc_list.length > 0}
      extra tag
    {/if}
  </Button>
</CardFooter>
