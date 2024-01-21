<script>
  const { ipcRenderer } = window.require('electron');
  import { Button } from 'sveltestrap';
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { nfc_read_test_enabled } from '../../services/store';
  import { reg_nfc_auto_enabled } from '../../services/store';
  import { e_nfc } from '../../services/enum';

  export let nfc_uid = undefined;
  export let nfc_status = undefined;

  let progress = 0;
  let open = false;
  let message = '';
  let contentClassName = 'bg-default';

  const handle_nfc_read = (ev) => {
    console.log('handle_nfc_read');
    ipcRenderer.send('nfc.read');

    contentClassName = 'bg-default';
    progress = 0;
    message = 'Start';
    open = true;
  };

  ipcRenderer.on('nfc.read.ok', (event, card, date_of_birth, member_id) => {
    console.log('nfc.read.ok');
    console.log('date_of_birth', date_of_birth);
    console.log('member_id', member_id);

    progress = 100;
    message = date_of_birth + ' ' + member_id;
  });

  ipcRenderer.on('nfc.read.fail', (event, card, str) => {
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
  && !reg_nfc_auto_enabled 
  && nfc_uid
  && (nfc_status === e_nfc.WRITABLE || nfc_status === e_nfc.OK)}
  <Button color=info
    title="Lees inhoud van NFC tag"
    on:click={handle_nfc_read}
  >
    Lees
  </Button>
{/if}
