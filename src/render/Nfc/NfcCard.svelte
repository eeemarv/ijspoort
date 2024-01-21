<script>
  import { Card, CardFooter } from 'sveltestrap';
  import NfcActivate from './NfcActivate.svelte';
  import NfcRegAuto from './NfcRegAuto.svelte';
  import NfcDeviceCardHeader from './NfcDeviceCardHeader.svelte';
  import NfcCardBody from './NfcCardBody.svelte';
  import NfcScan from './NfcScan.svelte';
  import NfcReadTest from './NfcReadTest.svelte';
  import NfcReset from './NfcReset.svelte';
  import { nfc_read_test_enabled } from '../services/store';
  import { nfc_reset_enabled } from '../services/store';
  import { reg_nfc_auto_enabled } from '../services/store';
  import NfcPersonAuto from './NfcPersonAuto.svelte';
  import { e_nfc } from '../services/enum';

  let nfc_status;
  let nfc_uid;
</script>

<NfcScan
  bind:nfc_status
  bind:nfc_uid
  on:scanned_person_valid_member
  on:scanned_person_not_member
/>

<Card class=my-2>
  <NfcDeviceCardHeader />
  <NfcCardBody {nfc_status} {nfc_uid} />
  <CardFooter>
    <div class="d-flex w100 justify-content-begin">
      <div>
        <NfcPersonAuto />
      </div>
    </div>
    <div class="d-flex w-100 justify-content-between">
      <div>
        <NfcRegAuto />
      </div>
      <div>
        <NfcActivate
          {nfc_uid}
          {nfc_status} 
          on:activated={() => { nfc_status = e_nfc.OK; }} 
        />
      </div>
    </div>
  </CardFooter>

  {#if true || (!$reg_nfc_auto_enabled
    && nfc_uid
    && (nfc_status === e_nfc.WRITABLE || nfc_status === e_nfc.OK)
    && ($nfc_read_test_enabled || $nfc_reset_enabled))
  }
    <CardFooter>
      <div class="d-flex w-100 justify-content-between">
        <div>
          <NfcReadTest {nfc_uid} {nfc_status} />
        </div>
        <div>
          <NfcReset {nfc_status} />
        </div>
      </div>
    </CardFooter>
  {/if}

</Card>
