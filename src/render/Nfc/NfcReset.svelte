<script>
  const { ipcRenderer } = window.require('electron');
  import { Button } from 'sveltestrap';
  import { db_nfc } from '../services/db';
  import { nfc_uid } from '../services/store';
  import { nfc_reset_enabled } from '../services/store';
  import NfcInfoModal from './NfcInfoModal.svelte';

  let open = false;
  let progress = 0;
  let message = '';
  let contentClassName = 'bg-default';

  const handle_nfc_reset = () => {
    message = 'Wis uit database';
    contentClassName = 'bg-default';
    progress = 0;
    open = true;

    console.log($nfc_uid);
    db_nfc.get('uid_' + $nfc_uid).catch((err) => {
      console.log(err);
      if (err.name === 'not_found'){
        return 'not_found';
      }
      throw err;
    }).then((doc) => {
      if (doc === 'not_found'){
        return 'not_from_database';
      }
      return db_nfc.remove(doc);
    }).then((res) => {
      console.log(res);
      console.log('nfc.reset', $nfc_uid);
      if (res === 'not_from_database'){
        message = 'Tag is niet aanwezig in database.';
        progress = 50;
      } else {
        message = 'Tag gewist uit database.';
        progress = 100;
      }
      ipcRenderer.send('nfc.reset');
    }).catch((err) => {
      console.log(err);
      progress = 50;
      contentClassName = 'bg-danger';
      message = 'Fout: ' + err;
    });
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

{#if $nfc_reset_enabled}
  <Button color=danger on:click={handle_nfc_reset} title="Wis deze NFC tag">
    Wis
  </Button>
{/if}
