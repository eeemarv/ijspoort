<script>
  import { Card, CardFooter } from 'sveltestrap';
  import NfcActivate from './NfcActivate.svelte';
  import NfcAutoReg from './NfcAutoReg.svelte';
  import NfcDeviceCardHeader from './NfcDeviceCardHeader.svelte';
  import NfcCardBody from './NfcCardBody.svelte';
  import NfcScan from './NfcScan.svelte';
  import NfcReadTest from './NfcReadTest.svelte';
  import NfcReset from './NfcReset.svelte';

  let nfc_status;
</script>

<NfcScan bind:nfc_status on:register />

<Card class=m-3>
  <NfcDeviceCardHeader />
  <NfcCardBody {nfc_status} />
  <NfcActivate {nfc_status} on:activated={() => { nfc_status = 'ok'; }} />
  <NfcAutoReg />
  <CardFooter>
    <div class="d-flex w-100 justify-content-between">
      <NfcReadTest {nfc_status} />
      <NfcReset {nfc_status} />
    </div>
  </CardFooter>
</Card>
