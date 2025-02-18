<script>
  import { CardText } from 'sveltestrap';
  import { sub_nfc_map } from '../../services/sub';
  import { ev_reg } from '../../services/events';

  let show_down_count = 0;
  const show_start_count = 50;
  const show_count_interval_time = 100;

  setInterval(() => {
    if (show_down_count){
      show_down_count = show_down_count - 1;
    }
  }, show_count_interval_time);

  const listen_events = {
    wait: window.bridge.onScanGateWait,
    full: window.bridge.onScanGateFull,
    person_valid_member: window.bridge.onScanGatePersonValidMember,
    person_not_member: window.bridge.onScanGatePersonNotMember,
    person_not_found: window.bridge.onScanGatePersonNotFound,
    nfc_not_found: window.bridge.onScanGateNfcNotFound,
    nfc_blocked: window.bridge.onScanGateNfcBlocked
  };

  let sev = undefined;
  let person_id = undefined;
  let person_id_already_registered = undefined;

  for (const [ev, onEv] of Object.entries(listen_events)){
    onEv((nfc_id) => {
      if (typeof nfc_id === 'string'){
        if (sub_nfc_map.has(nfc_id)){
          person_id = sub_nfc_map.get(nfc_id).person_id;
        } else {
          person_id = undefined;
        }
      } else {
        person_id = undefined;
      }
      sev = ev;
      show_down_count = show_start_count;
    });
  }

  ev_reg.addEventListener('change_add', (e) => {
    console.log('---- ev_reg change_add', e);
    if (typeof e.detail.person_id !== 'string'){
      return;
    }
    if (typeof person_id === 'undefined'){
      return;
    }
    if (person_id !== e.detail.person_id){
      return;
    }
    if (typeof e.detail.invalid === 'undefined'){
      return;
    }
    if (typeof e.detail.invalid.ts_recent === 'undefined'){
      return;
    }
    person_id_already_registered = person_id;
  });

  $: if (show_down_count === 0){
    person_id = undefined;
    sev = undefined;
    person_id_already_registered = undefined;
  }
</script>

<div class="card-body py-2"
  class:bg-success={sev === 'person_valid_member'}
  class:bg-purple={sev === 'wait' || sev === 'full' || sev === 'nfc_blocked' || sev === 'person_not_member'}
  class:bg-danger={sev === 'nfc_not_found' || sev === 'person_not_found'}
>
  <CardText class="py-0 mb-0">
    {#if show_down_count}
      {#if sev === 'person_valid_member'}
        Ok
          {#if person_id
            && person_id_already_registered
            && person_id === person_id_already_registered
          }
            - <i>Reeds geregistreerd</i>
          {/if}
      {:else if sev === 'person_not_member'}
        Lidmaatschap niet in orde
      {:else if sev === 'person_not_found'}
        Geen persoonsdata
      {:else if sev === 'nfc_not_found'}
        NFC tag niet herkend
      {:else if sev === 'nfc_blocked'}
        NFC tag geblokkeerd
      {:else if sev === 'wait'}
        Even wachten...
      {:else if sev === 'full'}
        Volzet
      {:else}
        ---
      {/if}
    {:else}
      ---
    {/if}
  </CardText>
</div>