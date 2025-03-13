<script>
  import { nfc_del } from '../../../db_put/nfc_put';
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { nfc_id_to_uid } from '../../../nfc/nfc_id';
  import { nfc_test_transport_key } from '../../../nfc/nfc_test_key';

  export let nfc_id;

  let open = false;
  let progress = 0;
  let message = '';
  let contentClassName = 'bg-default';

  export const handle_nfc_clear = async () => {
    message = 'Wis uit database';
    contentClassName = 'bg-default';
    progress = 0;
    open = true;

    nfc_del(nfc_id);
    const nfc_uid = nfc_id_to_uid(nfc_id);

    const d = await window.bridge.invokeNfcReset({nfc_uid});

    if (typeof d.error === 'undefined'){
      setTimeout(() => {
        open = false;
      }, 1000);
      progress = 100;
      message = 'Wissen voltooid, test transport sleutel.';
      contentClassName = 'bg-success';

      nfc_test_transport_key({nfc_uid});
      return;
    }
    message = 'Gewist uit database, doch fout bij wissen NFC tag.';
    contentClassName = 'bg-danger';
    progress = 50;
    console.log('nfc.reset', data);
  };
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
