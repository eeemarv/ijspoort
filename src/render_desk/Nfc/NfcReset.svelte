<script>
  const { ipcRenderer } = window.require('electron');
  import { Button } from 'sveltestrap';
  import { nfc_del } from '../../db_put/nfc_put';
  import { nfc_map } from '../../services/store';
  import { nfc_reset_enabled } from '../../services/store';
  import { reg_nfc_auto_enabled } from '../../services/store';
  import { selected_nfc_id } from '../../services/store';
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { en_nfc } from '../../services/enum';

  export let nfc_status;

  let open = false;
  let progress = 0;
  let message = '';
  let contentClassName = 'bg-default';

  const handle_nfc_reset = () => {
    message = 'Wis uit database';
    contentClassName = 'bg-default';
    progress = 0;
    open = true;

    nfc_del($nfc_map.get($selected_nfc_id));
    ipcRenderer.send('nfc.reset');
  };

  ipcRenderer.on('nfc.reset.ok', (ev, card) => {
    setTimeout(() => {
      open = false;
    }, 1000);
    progress = 100;
    message = 'Wissen voltooid, test transport sleutel.';
    contentClassName = 'bg-success';

    ipcRenderer.send('nfc.test_transport_key');
    console.log('nfc.reset.ok');
  });

  ipcRenderer.on('nfc.reset.fail', (ev, card) => {
    message = 'Gewist uit database, doch fout bij wissen NFC tag.';
    contentClassName = 'bg-danger';
    progress = 50;
    console.log('nfc.reset.fail');
  });

</script>

<NfcInfoModal {open} {progress} {contentClassName}>
  <h1 slot=title>Wis NFC tag</h1>
  <p slot=message>
    {message}
  </p>
</NfcInfoModal>

{#if !$reg_nfc_auto_enabled && $nfc_reset_enabled && $selected_nfc_id && nfc_status === en_nfc.OK}
  <Button color=danger on:click={handle_nfc_reset} title="Wis deze NFC tag">
    Wis
  </Button>
{/if}
