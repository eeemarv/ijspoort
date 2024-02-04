<script>
  import NfcCountButton from './NfcCountButton.svelte';
  import { ev_nfc_scan } from '../../services/events';

  let on;
  let error;

  ev_nfc_scan.addEventListener('nfc_device_on', () => {
    on = true;
  });
  ev_nfc_scan.addEventListener('nfc_device_off', () => {
    on = false;
  });
  ev_nfc_scan.addEventListener('nfc_device_error', () => {
    error = true;
  });
  ev_nfc_scan.addEventListener('nfc_device_no_error', () => {
    error = false;
  });

</script>

<div class="card-header py-2 d-flex w-100 justify-content-between"
  class:bg-success={on && !error}
  class:bg-danger={error}
>
  <div title="Nfc/RFiD tags">
    NFC
    {error ? ' fout apparaat' : ''}
  </div>
  <div>
    <NfcCountButton />
  </div>
</div>
