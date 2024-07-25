<script>
  const { ipcRenderer } = window.require('electron');
  import { CardText } from 'sveltestrap';
  import { sub_nfc_map } from '../../services/sub';
  import { person_is_already_registered } from '../../person/person_already_registered';

  let show_down_count = 0;
  const show_start_count = 50;
  const show_count_interval_time = 100;

  setInterval(() => {
    if (show_down_count){
      show_down_count = show_down_count - 1;
    }
  }, show_count_interval_time);

  const listen_ary = [
    'wait',
    'full',
    'person_valid_member',
    'person_not_member',
    'person_not_found',
    'nfc_not_found',
    'nfc_blocked'
  ];

  let sev = undefined;
  let person_id = undefined;

  for (const ev of listen_ary){
    ipcRenderer.on('scan.gate.' + ev, (e, nfc_id) => {
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

  $: if (show_down_count === 0){
    person_id = undefined;
    sev = undefined;
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
          {#if person_id && person_is_already_registered(person_id) }
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