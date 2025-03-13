<script>
  import NfcInfoModal from './NfcInfoModal.svelte';
  import { nfc_id_to_uid } from '../../../nfc/nfc_id';

  export let nfc_id;

  let progress = 0;
  let open = false;
  let message = '';
  let contentClassName = 'bg-dark';

  export const handle_nfc_read_test = async () => {
    console.log('handle_nfc_read');
    const nfc_uid = nfc_id_to_uid(nfc_id);
    contentClassName = 'bg-dark';
    progress = 0;
    message = 'Start';
    open = true;

    const d = await window.bridge.invokeNfcRead({nfc_uid});

    if (typeof d.error === 'undefined'){
      console.log('nfc.read.ok', d);
      progress = 100;
      message = d.date_of_birth + '.' + d.member_id;

      return;
    }

    contentClassName = 'bg-danger';
    progress = 50;
    message = 'Test niet geslaagd.';
  };
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
