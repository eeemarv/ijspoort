<script>
  import { Card, CardFooter } from 'sveltestrap';
  import NfcActivate from './NfcActivate.svelte';
  import NfcRegAuto from './NfcRegAuto.svelte';
  import NfcDeviceCardHeader from './NfcDeviceCardHeader.svelte';
  import NfcCardBody from './NfcCardBody.svelte';
  import NfcReadTest from './NfcReadTest.svelte';
  import NfcReset from './NfcReset.svelte';
  import { nfc_read_test_enabled } from '../../services/store';
  import { nfc_reset_enabled } from '../../services/store';
  import { reg_nfc_auto_enabled } from '../../services/store';
  import NfcPersonAuto from './NfcPersonAuto.svelte';
  import { en_nfc_status } from '../../services/enum';
  import { ev_nfc_scan } from '../../services/events';

  let nfc_status = en_nfc_status.OFF;
  let nfc_id = undefined;

  for (const k in en_nfc_status){
    ev_nfc_scan.addEventListener(en_nfc_status[k], (e) => {
      nfc_status = en_nfc_status[k];
      nfc_id = e.detail.nfc_id ?? undefined;
    });
  }
  ev_nfc_scan.addEventListener('nfc_device_error', () => {
    nfc_id = undefined;
    nfc_status = en_nfc_status.OFF;
  });
  ev_nfc_scan.addEventListener('nfc_device_off', () => {
    nfc_id = undefined;
    nfc_status = en_nfc_status.OFF;
  }); 
</script>

<Card class=my-2>
  <NfcDeviceCardHeader />
  <NfcCardBody {nfc_status} {nfc_id} />
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
          {nfc_id}
          {nfc_status} 
          on:activated={() => { nfc_status = en_nfc_status.FOUND; }} 
        />
      </div>
    </div>
  </CardFooter>

  {#if (!$reg_nfc_auto_enabled
    && nfc_id
    && (nfc_status === en_nfc_status.WRITABLE 
      || nfc_status === en_nfc_status.FOUND)
    && ($nfc_read_test_enabled || $nfc_reset_enabled))
  }
    <CardFooter>
      <div class="d-flex w-100 justify-content-between">
        <div>
          <NfcReadTest {nfc_id} {nfc_status} />
        </div>
        <div>
          <NfcReset {nfc_id} {nfc_status} />
        </div>
      </div>
    </CardFooter>
  {/if}
</Card>
