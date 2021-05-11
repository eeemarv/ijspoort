<script>
  const { ipcRenderer } = window.require('electron');
  const env = window.require('electron').remote.process.env;
  import { Button } from 'sveltestrap';
  import { db_nfc } from '../services/db';
  import { nfc_uid, nfc_auto_reg } from '../services/store';
  import NfcModal from './NfcModal.svelte';

  const nfc_reset_writable_enabled = env.NFC_RESET_WRITABLE_ENABLED === '1';
  const nfc_reset_enabled = env.NFC_RESET_ENABLED === '1';

  export let nfc_status;
  let nfc_modal;

  const handle_nfc_reset = () => {
    nfc_modal.start('Wis uit database');
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
        nfc_modal.stop('Tag is niet aanwezig in database.', 50);
      } else {
        nfc_modal.stop('Tag gewist uit database.');
      }
      ipcRenderer.send('nfc.reset');
    }).catch((err) => {
      console.log(err);
      nfc_modal.stop('Fout: ' + err, 0);
    });
  };

  ipcRenderer.on('nfc.reset.ok', (ev, card) => {
    nfc_modal.stop_timeout('Wissen voltooid, test transport sleutel.', 100, 1000);
    ipcRenderer.send('nfc.test_transport_key');
    console.log('nfc.reset.ok');
  });

  ipcRenderer.on('nfc.reset.fail', (ev, card) => {
    nfc_modal.stop('Gewist uit database, doch fout bij wissen NFC tag.', 50);
    console.log('nfc.reset.fail');
  });

</script>

<NfcModal bind:this={nfc_modal} title="Wis NFC tag" />

{#if !$nfc_auto_reg
  && nfc_reset_enabled
  && $nfc_uid
  && (nfc_status === 'ok' || (nfc_status === 'writable' && nfc_reset_writable_enabled))
}
  <Button color=danger on:click={handle_nfc_reset} title="Wis deze NFC tag">
    Wis
  </Button>
{/if}
