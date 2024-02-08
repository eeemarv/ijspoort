<script>
  const { ipcRenderer } = window.require('electron');
  import { CardText } from 'sveltestrap';
  import { sub_nfc_map } from '../../services/sub';
  const msgs = {
    wait: {
      msg: 'Wacht even tot je voorganger door de poort is en probeer opnieuw.',
      color: 'purple',
      person: false,
      gate_auth: true
    },
    full: {
      msg: 'Volzet',
      color: 'purple',
      person: true,
      gate_auth: true
    },
    person_valid_member: {
      msg: 'Ok',
      color: 'success',
      person: true,
      open_gate: true,
      gate_auth: true
    },
    person_not_member: {
      msg: 'Lidmaatschap niet in orde',
      color: 'purple',
      person: true,
      gate_auth: false
    },
    nfc_not_found: {
      msg: 'Tag niet herkend',
      color: 'danger',
      person: false,
      gate_auth: false
    },
    person_not_found: {
      msg: 'Geen personsdata gevonden',
      color: 'danger',
      person: false,
      gate_auth: false
    },
    nfc_blocked: {
      msg: 'Tag geblokkeerd',
      color: 'purple',
      person: true,
      gate_auth: false
    },
    person_already_registered: {}
  };

  const listen_ary = [
    'wait', 
    'full', 
    'person_valid_member',
    'person_not_member',
    'person_not_found',
    'nfc_not_found',
    'nfc_blocked',
    'already_registered'
  ];

  let timeout_id = undefined;
  let sev = undefined;
  const show_time = 5000;
  let person_id = undefined;
  let already_registered_person_id = undefined;

  for (const ev of listen_ary){
    ipcRenderer.on('scan.gate.' + ev, (e, nfc_id) => {
      if (typeof nfc_id === 'string'){
        if (sub_nfc_map.has(nfc_id)){
          const prsn_id = sub_nfc_map.get(nfc_id).person_id;        
        }
      }
      if (ev === 'person_already_registered'){
        if (typeof prsn_id === 'string'){
          already_registered_person_id = prsn_id;
        }
        return;
      }
      clearTimeout(timeout_id);
      setTimeout(() => {
        sev = undefined;
        person_id = undefined;
        already_registered_person_id = undefined;
      }, show_time);
      sev = ev;
      if (typeof prsn_id === 'string'){
        person_id = prsn_id;
      }
    });
  } 
</script>

<div class="card-body py-2"
  class:bg-success={sev === 'person_valid_member'}
  class:bg-purple={sev === 'wait' || sev === 'full' || sev === 'nfc_blocked' || sev === 'person_not_member'}
  class:bg-danger={sev === 'nfc_not_found' || sev === 'person_not_found'}
>
  <CardText class="py-0 mb-0">
    {#if sev === 'person_valid_member'}
      Ok
        {#if person_id && already_registered_person_id === person_id}
          , <i>Reeds geregistreerd</i>
        {/if}
    {:else if sev === 'person_not_member'}
      Lidmaatschap niet in orde
    {:else if sev === 'person_not_found'}
      Geen persoonsdata
    {:else if sev === 'nfc_not_found'}
      NFC tag niet gevonden
    {:else if sev === 'nfc_blocked'}
      NFC tag geblokkeerd
    {:else if sev === 'wait'}
      Even wachten...
    {:else if sev === 'full'}
      Volzet
    {:else}
      ---
    {/if}
  </CardText>
</div>