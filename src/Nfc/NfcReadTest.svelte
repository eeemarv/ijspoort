<script>
  const { ipcRenderer } = window.require('electron');
  import { Button } from 'sveltestrap';
  import { nfc_auto_reg, nfc_uid } from '../services/store';
  import NfcModal from './NfcModal.svelte';

  export let nfc_status;
  let nfc_modal;

  const handle_nfc_read = (ev) => {
    console.log('handle_nfc_read');
    nfc_modal.start('Start');
    ipcRenderer.send('nfc.read');
  };

  ipcRenderer.on('nfc.read.ok', (event, card, date_of_birth, member_id) => {
    console.log('nfc.read.ok');
    console.log('date_of_birth', date_of_birth);
    console.log('member_id', member_id);
    nfc_modal.stop(date_of_birth + ' ' + member_id, 100);
  });

  ipcRenderer.on('nfc.read.fail', (event, card, str) => {
    nfc_modal.stop('Test niet geslaagd.', 50);
  });
</script>

<NfcModal bind:this={nfc_modal} title="Lees NFC tag" />

{#if !$nfc_auto_reg
  && $nfc_uid
  && (nfc_status === 'writable' || nfc_status === 'ok')
}
  <Button color=info
    title="Lees inhoud van NFC tag"
    on:click={handle_nfc_read}
  >
    Lees
  </Button>
{/if}
