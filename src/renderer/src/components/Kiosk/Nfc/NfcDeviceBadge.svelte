<script>
  import { ev_nfc_scan } from '../../../services/events';

  export let font_size = '1em';
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

<span class="badge me-2"
  class:bg-success={on && !error}
  class:bg-danger={error}
  class:bg-dark={!on && !error}
  title="Status NFC tag scanner"
  style="font-size: {font_size};"
>
  NFC
</span>

<style>
  span {
    font-size: var(--font-size);
  }
</style>