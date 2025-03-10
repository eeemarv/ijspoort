<script>
//  const { ipcRenderer } = window.require('electron');
  import { nfc_del } from '../../../db_put/nfc_put';
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { nfc_id_to_uid } from '../../../nfc/nfc_id';

  export let nfc_id;

  let open = false;
  let progress = 0;
  let message = '';
  let contentClassName = 'bg-default';

  export const handle_nfc_clear = () => {
    message = 'Wis uit database';
    contentClassName = 'bg-default';
    progress = 0;
    open = true;

    nfc_del(nfc_id);
    const nfc_uid = nfc_id_to_uid(nfc_id);
    window.bridge.sendNfcReset({nfc_uid});
  };

  window.bridge.onNfcResetOk((data) => {
    setTimeout(() => {
      open = false;
    }, 1000);
    progress = 100;
    message = 'Wissen voltooid, test transport sleutel.';
    contentClassName = 'bg-success';

    ipcRenderer.send('nfc.test_transport_key', {...data});
    console.log('nfc.reset.ok');
  });

  window.bridge.onNfcResetFail((data) => {
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
