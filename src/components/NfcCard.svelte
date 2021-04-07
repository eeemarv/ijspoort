<script>
  import { Card } from 'sveltestrap';
  import NfcActivate from './NfcActivate.svelte';
  import NfcAutoReg from './NfcAutoReg.svelte';
  import NfcDeviceCardHeading from './NfcDeviceCardHeading.svelte';
  import NfcCardBody from './NfcCardBody.svelte';
  import NfcReadAndReset from './NfcReadAndReset.svelte';
  import NfcScan from './NfcScan.svelte';

  let nfc_status;
</script>

<NfcScan bind:nfc_status on:register />

<Card class=m-3>
  <NfcDeviceCardHeading />
  <NfcCardBody {nfc_status} />
  <NfcActivate {nfc_status} on:activated={() => { nfc_status = 'ok'; }} />
  <NfcAutoReg />
  <NfcReadAndReset {nfc_status} />
</Card>
