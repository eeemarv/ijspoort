<script>
  const { ipcRenderer } = window.require('electron');
  import { Button } from 'sveltestrap';
  import { nfc_del } from '../../db_put/nfc_put';
  import { nfc_reset_enabled } from '../../services/store';
  import { reg_nfc_auto_enabled } from '../../services/store';
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { en_nfc_status } from '../../services/enum';
  import { nfc_id_to_uid } from '../../nfc/nfc_scan';

  export let nfc_status;
  export let nfc_id;

  let open = false;
  let progress = 0;
  let message = '';
  let contentClassName = 'bg-default';

  const handle_nfc_reset = () => {
    message = 'Wis uit database';
    contentClassName = 'bg-default';
    progress = 0;
    open = true;

    nfc_del(nfc_id);
    const nfc_uid = nfc_id_to_uid(nfc_id);
    ipcRenderer.send('nfc.reset', {nfc_uid});
  };

  ipcRenderer.on('nfc.reset.ok', (ev, data) => {
    setTimeout(() => {
      open = false; 
    }, 1000);
    progress = 100; 
    message = 'Wissen voltooid, test transport sleutel.';
    contentClassName = 'bg-success';

    ipcRenderer.send('nfc.test_transport_key', {...data});
    console.log('nfc.reset.ok');
  });

  ipcRenderer.on('nfc.reset.fail', (ev, data) => {
    message = 'Gewist uit database, doch fout bij wissen NFC tag.';
    contentClassName = 'bg-danger';
    progress = 50;
    console.log('nfc.reset.fail', data);
  });
</script>

<NfcInfoModal 
  bind:open 
  {progress} 
  {contentClassName}
>
  <h1 slot=title>
    Wis NFC tag
  </h1>
  <p slot=message>
    {message}
  </p>
</NfcInfoModal>

{#if !$reg_nfc_auto_enabled 
  && $nfc_reset_enabled 
  && nfc_id 
  && nfc_status === en_nfc_status.FOUND
}
  <Button 
    color=danger 
    on:click={handle_nfc_reset} 
    title="Wis deze NFC tag"
  >
    Wis
  </Button>
{/if}
