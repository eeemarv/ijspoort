<script>
  import { Card, CardFooter } from 'sveltestrap';
  import NfcActivate from './NfcActivate.svelte';
  import NfcRegAuto from './NfcRegAuto.svelte';
  import NfcDeviceCardHeader from './NfcDeviceCardHeader.svelte';
  import NfcCardBody from './NfcCardBody.svelte';
  import NfcScan from './NfcScan.svelte';
  import NfcReadTest from './NfcReadTest.svelte';
  import NfcReset from './NfcReset.svelte';
  import { nfc_uid } from '../services/store';
  import { nfc_read_test_enabled } from '../services/store';
  import { nfc_reset_enabled } from '../services/store';
  import { reg_nfc_auto_enabled } from '../services/store';

  let nfc_status;
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

<Card class=my-2>
  <NfcDeviceCardHeader />
  <NfcCardBody {nfc_status} />
  <CardFooter>
    <div class="d-flex w-100 justify-content-between">
      <div>
        <NfcRegAuto />
      </div>
      <div>
        <NfcActivate {nfc_status} on:activated={() => { nfc_status = 'ok'; }} />
      </div>
    </div>
  </CardFooter>
  {#if !$reg_nfc_auto_enabled
    && $nfc_uid
    && (nfc_status === 'writable' || nfc_status === 'ok')
    && ($nfc_read_test_enabled || $nfc_reset_enabled)
  }
    <CardFooter>
      <div class="d-flex w-100 justify-content-between">
        <div>
          <NfcReadTest />
        </div>
        <div>
          <NfcReset />
        </div>
      </div>
    </CardFooter>
  {/if}
</Card>
