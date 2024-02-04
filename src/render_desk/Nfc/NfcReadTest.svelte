<script>
  const { ipcRenderer } = window.require('electron');
  import { Button } from 'sveltestrap';
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { nfc_read_test_enabled } from '../../services/store';
  import { reg_nfc_auto_enabled } from '../../services/store';
  import { en_nfc_status } from '../../services/enum';
  import { nfc_id_to_uid } from '../../nfc/nfc_scan';

  export let nfc_id;
  export let nfc_status;

  let progress = 0;
  let open = false;
  let message = '';
  let contentClassName = 'bg-default';

  const handle_nfc_read = (ev) => {
    console.log('handle_nfc_read');
    const nfc_uid = nfc_id_to_uid(nfc_id);
    ipcRenderer.send('nfc.read', {nfc_uid});

    contentClassName = 'bg-default';
    progress = 0;
    message = 'Start';
    open = true;
  };

  ipcRenderer.on('nfc.read.ok', (event, data) => {
    console.log('nfc.read.ok', data);

    progress = 100;
    message = data.date_of_birth + '.' + data.member_id;
  });

  ipcRenderer.on('nfc.read.fail', (event, data) => {
    contentClassName = 'bg-danger';
    progress = 50;
    message = 'Test niet geslaagd.';
  });
</script>

<NfcInfoModal {open} {progress} {contentClassName}>
  <h1 slot=title>Lees NFC tag</h1>
  <p slot=message>
    {message}
  </p>
</NfcInfoModal>

{#if $nfc_read_test_enabled
  && !$reg_nfc_auto_enabled 
  && nfc_id
  && (nfc_status === en_nfc_status.WRITABLE || nfc_status === en_nfc_status.FOUND)}
  <Button color=info
    title="Lees inhoud van NFC tag"
    on:click={handle_nfc_read}
  >
    Lees
  </Button>
{/if}

