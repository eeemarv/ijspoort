<script>
  const { ipcRenderer } = window.require('electron');
  import { Button } from 'sveltestrap';
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { desk_nfc_read_test_button_enabled } from '../../services/store';
  import { desk_nfc_auto_reg_enabled } from '../../services/store';
  import { en_nfc_status } from '../../services/enum';
  import { nfc_id_to_uid } from '../../nfc/nfc_id';

  export let nfc_id;
  export let nfc_status;

  let progress = 0;
  let open = false;
  let message = '';
  let contentClassName = 'bg-dark';

  const handle_nfc_read = () => {
    console.log('handle_nfc_read');
    const nfc_uid = nfc_id_to_uid(nfc_id);
    ipcRenderer.send('nfc.read', {nfc_uid});

    contentClassName = 'bg-dark';
    progress = 0;
    message = 'Start';
    open = true;
  };

  ipcRenderer.on('nfc.read.ok', (ev, data) => {
    console.log('nfc.read.ok', data);
    progress = 100;
    message = data.date_of_birth + '.' + data.member_id;
  });

  ipcRenderer.on('nfc.read.fail', (ev, data) => {
    contentClassName = 'bg-danger';
    progress = 50;
    message = 'Test niet geslaagd.';
  });
</script>

<NfcInfoModal
  bind:open
  {progress}
  {contentClassName}
>
  <h1 slot=title>
    Lees NFC tag
  </h1>
  <p slot=message>
    {message}
  </p>
</NfcInfoModal>

{#if $desk_nfc_read_test_button_enabled
  && !$desk_nfc_auto_reg_enabled
  && nfc_id
  && (nfc_status === en_nfc_status.WRITABLE || nfc_status === en_nfc_status.FOUND)}
  <Button
    color=info
    title="Lees inhoud van NFC tag"
    on:click={handle_nfc_read}
  >
    Lees
  </Button>
{/if}
