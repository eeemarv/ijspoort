<script>
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import { db_nfc } from '../services/db';
  import { person, person_nfc_list } from '../services/store';
  import { nfc_uid } from '../services/store';
  import NfcInfoModal from './NfcInfoModal.svelte';

  export let nfc_status;
  let open = false;
  let progress = 0;
  let message = '';
  let contentClassName = 'bg-default';

  const dispatch = createEventDispatcher();

  $: can_activate = $person && $nfc_uid && nfc_status === 'transport_key';

  const handle_activate_nfc = () => {
    console.log('handle_activate_nfc');
    progress = 0;
    message = 'Schrijf sleutels';
    contentClassName = 'bg-default';
    open = true;
    console.log('send nfc.init');
    ipcRenderer.send('nfc.init', $person);
  };

  ipcRenderer.on('nfc.init.ok', (ev, card) => {
    add_nfc();
    setTimeout(() => {
      open = false;
    }, 1000);
    message = 'Initialisatie ok.';
    contentClassName = 'bg-success';
    progress = 100;
  });

  ipcRenderer.on('nfc.init.fail', (ev, card) => {
    setTimeout(() => {
      open = false;
    }, 5000);
    message = 'Initialisatie niet gelukt.';
    contentClassName = 'bg-danger';
    progress = 20;
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

<NfcInfoModal {open} {progress} {contentClassName}>
  <h1 slot=title>Activeer NFC tag</h1>
  <p slot=message>
    {message}
  </p>
</NfcInfoModal>


<Button
  color={$person_nfc_list.length > 0 ? 'warning' : 'success'}
  title="Activeer deze NFC-tag voor deze persoon"
  disabled={!can_activate}
  on:click={handle_activate_nfc}>
  Activeer
  {#if $person_nfc_list.length > 0}
    extra
  {/if}
</Button>
