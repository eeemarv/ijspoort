<script>
  import { Card, CardFooter } from 'sveltestrap';
  import NfcActivate from './NfcActivate.svelte';
  import NfcRegAuto from './NfcRegAuto.svelte';
  import NfcDeviceCardHeader from './NfcDeviceCardHeader.svelte';
  import NfcCardBody from './NfcCardBody.svelte';
  import NfcReadTest from './NfcReadTest.svelte';
  import NfcReset from './NfcReset.svelte';
  import NfcPersonAuto from './NfcPersonAuto.svelte';
  import { en_nfc_status } from '../../services/enum';
  import { ev_nfc_scan } from '../../services/events';
  import { desk_selected_nfc_id } from '../../services/store';

  let nfc_status = en_nfc_status.OFF;
  $: nfc_id = $desk_selected_nfc_id;

  for (const k in en_nfc_status){
    ev_nfc_scan.addEventListener(en_nfc_status[k], (e) => {
      nfc_status = en_nfc_status[k];
    });
  }

  ev_nfc_scan.addEventListener('nfc_device_error', () => {
    nfc_status = en_nfc_status.OFF;
  });

  ev_nfc_scan.addEventListener('nfc_device_off', () => {
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
</Card>
