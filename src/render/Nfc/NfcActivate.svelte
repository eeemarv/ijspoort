<script>
  const { ipcRenderer } = window.require('electron');
  import { Button } from 'sveltestrap';
  import { nfc_map } from '../../services/store';
  import { person_map } from '../../services/store';
  import { person_nfc_map } from '../../services/store';
  import { selected_person_id } from '../../services/store';
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { nfc_add } from '../../db_put/nfc_put';
  import { e_nfc } from '../../services/enum';

  export let nfc_status;
  export let nfc_uid;

  let open = false;
  let progress = 0;
  let message = '';
  let contentClassName = 'bg-default';

  const handle_activate_nfc = () => {
    if (!$selected_person_id){
      return;
    }

    if (!$person_map.has($selected_person_id)){
      return;
    }

    if (typeof !nfc_uid !== 'string'){
      return;
    }

    if ($nfc_map.has('uid_' + nfc_uid)){
      return;
    }

    console.log('handle_activate_nfc');
    progress = 0;
    message = 'Schrijf sleutels';
    contentClassName = 'bg-default';
    open = true;
    console.log('send nfc.init');
    ipcRenderer.send('nfc.init', $person_map.get($selected_person_id));
  };

  ipcRenderer.on('nfc.init.ok', (ev, card) => {
    nfc_add($selected_person_id, nfc_uid);
    dispatch('activated');
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

  $: person_nfc_count = $person_nfc_map.get($selected_person_id)?.size ?? 0;
</script>

<NfcInfoModal {open} {progress} {contentClassName}>
  <h1 slot=title>Activeer NFC tag</h1>
  <p slot=message>
    {message}
  </p>
</NfcInfoModal>


<Button
  color={person_nfc_count > 0 ? 'warning' : 'success'}
  title="Activeer deze NFC-tag voor deze persoon"
  disabled={!nfc_uid || !$selected_person_id || nfc_status !== e_nfc.TRANSPORT_KEY || $nfc_map.has('uid_' + nfc_uid)}
  on:click={handle_activate_nfc}>
  Activeer
  {#if person_nfc_count > 0}
    extra
  {/if}
</Button>
