<script>
  import { Card, CardFooter } from 'sveltestrap';
  import NfcActivate from './NfcActivate.svelte';
  import NfcRegAuto from './NfcRegAuto.svelte';
  import NfcDeviceCardHeader from './NfcDeviceCardHeader.svelte';
  import NfcCardBody from './NfcCardBody.svelte';
  import NfcScan from './NfcScan.svelte';
  import NfcReadTest from './NfcReadTest.svelte';
  import NfcReset from './NfcReset.svelte';

  let nfc_status;
  export let reg_auto_enabled;
</script>

<NfcScan
  bind:nfc_status
  on:scanned_person_valid_member
  on:scanned_person_not_member
  on:scanned_person_found
  on:scanned_person_not_found
  on:scanned_uid_found
  on:scanned_uid_not_found
  on:scanned_uid_blocked

  on:nfc_on
  on:nfc_off
/>

<Card class=m-3>
  <NfcDeviceCardHeader />
  <NfcCardBody {nfc_status} />
  <NfcActivate {nfc_status} on:activated={() => { nfc_status = 'ok'; }} />
  <NfcRegAuto bind:reg_auto_enabled />
  <CardFooter>
    <div class="d-flex w-100 justify-content-between">
      <NfcReadTest {nfc_status} {reg_auto_enabled} />
      <NfcReset {nfc_status} {reg_auto_enabled} />
    </div>
  </CardFooter>
</Card>
