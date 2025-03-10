<script>
  import { Card } from 'sveltestrap';
  import NfcActivate from './NfcActivate.svelte';
  import NfcDeviceCardHeader from './NfcDeviceCardHeader.svelte';
  import { en_nfc_status } from '../../../services/enum';
  import { ev_nfc_scan } from '../../../services/events';
  import { desk_selected_nfc_id } from '../../../services/store';
  import NfcStatus from './NfcStatus.svelte';
  import NfcPersonDataOpen from './NfcPersonDataOpen.svelte';
  import NfcReg from './NfcReg.svelte';
  import NfcActions from './NfcActions.svelte';

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
  <div class="list-group list-group-flush">
    <NfcStatus {nfc_id} {nfc_status} />
    <NfcActions {nfc_id} {nfc_status} />
    <NfcActivate
      {nfc_id}
      {nfc_status}
      on:activated={() => { nfc_status = en_nfc_status.FOUND; }}
    />
    <NfcPersonDataOpen />
    <NfcReg />
  </div>
</Card>
