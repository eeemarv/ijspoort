<script>
//  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher } from 'svelte';
  import { Button } from '@sveltestrap/sveltestrap';
  import { nfc_map } from '../../../services/store';
  import { person_map } from '../../../services/store';
  import { person_nfc_map } from '../../../services/store';
  import { desk_selected_person_id } from '../../../services/store';
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { nfc_add } from '../../../db_put/nfc_put';
  import { en_nfc_status } from '../../../services/enum';
  import { nfc_uid_to_id } from '../../../nfc/nfc_id';
  import { nfc_id_to_uid } from '../../../nfc/nfc_id';

  const dispatch = createEventDispatcher();

  export let nfc_status;
  export let nfc_id;

  let open = false;
  let progress = 0;
  let message = '';
  let contentClassName = 'bg-default';

  const handle_activate_nfc = () => {
    if (!$desk_selected_person_id){
      return;
    }

    if (!$person_map.has($desk_selected_person_id)){
      return;
    }

    if (typeof nfc_id !== 'string'){
      return;
    }

    if ($nfc_map.has(nfc_id)){
      return;
    }

    console.log('handle_activate_nfc');
    progress = 0;
    message = 'Schrijf sleutels';
    contentClassName = 'bg-default';
    open = true;
    console.log('send nfc.init');
    const data = {
      person: {...$person_map.get($desk_selected_person_id)},
      nfc_uid: nfc_id_to_uid(nfc_id)
    };
    ipcRenderer.send('nfc.init', data);
    window.bridge.sendNfcInit(data);
  };

  window.bridge.onNfcInitOk((data) => {
    nfc_add($desk_selected_person_id, nfc_uid_to_id(data.nfc_uid));
    dispatch('activated');
    setTimeout(() => {
      open = false;
    }, 1000);
    message = 'Initialisatie ok.';
    contentClassName = 'bg-success';
    progress = 100;
  });

  window.bridge.onNfcInitFail((data) => {
    setTimeout(() => {
      open = false;
    }, 5000);
    message = 'Initialisatie niet gelukt.';
    contentClassName = 'bg-danger';
    progress = 20;
  });

  $: person_nfc_count = $person_nfc_map.get($desk_selected_person_id)?.size ?? 0;
</script>

<NfcInfoModal
  bind:open
  {progress}
  {contentClassName}
>
  <h1 slot=title>Activeer NFC tag</h1>
  <p slot=message>
    {message}
  </p>
</NfcInfoModal>

<div class="list-group-item">
  <Button
    color={person_nfc_count > 0 ? 'warning' : 'success'}
    title="Activeer deze NFC-tag voor deze persoon"
    disabled={!nfc_id || !$desk_selected_person_id || nfc_status !== en_nfc_status.TRANSPORT_KEY_OK || $nfc_map.has(nfc_id)}
    on:click={handle_activate_nfc}>
    Activeer
    {#if person_nfc_count > 0}
      extra
    {/if}
  </Button>
</div>
