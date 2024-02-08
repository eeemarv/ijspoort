<script>
  const { ipcRenderer } = window.require('electron');
  import { sub_nfc_map } from '../../services/sub';
  import { sub_person_last_reg_ts_map } from '../../services/sub';
  import PersonTag from '../../render/Person/PersonTag.svelte';
  import { Badge } from 'sveltestrap';
  import { get_time_str } from '../../services/functions';
  import { reg_block_time } from '../../db_put/reg_put';

  let timeout_id = undefined;
  const show_time = 3000;
  let msg_id = undefined;
  let person_id = undefined;
  let color = 'red';
  let msg = undefined;

  const listen = {
    person_already_registered: {
      person: true,
      msg: 'x',
      color: 'purple'
    },
    nfc_not_found: {
      person: false,
      msg: 'NFC tag niet herkend',
      color: 'red'
    },
    person_not_found: {
      person: false,
      msg: 'Persoon niet (meer) gelinkt aan NFC tag',
      color: 'red'
    },
    person_not_member: {
      person: true,
      msg: 'Lidmaatschap niet in orde',
      color: 'red'
    },
    nfc_blocked: {
      person: true,
      msg: 'NFC tag geblokkeerd',
      color: 'purple'
    }
  };

  for (const prop in listen){
    ipcRenderer.on('scan.' + prop, (ev, nfc_id) => {
      const d = listen[prop];
      if (d.person === true){
        if (typeof nfc_id !== 'string'){
          return;
        }
        if (!sub_nfc_map.has(nfc_id)){
          return;
        }
        person_id = sub_nfc_map.get(nfc_id).person_id; 
      } else {
        person_id = undefined;
      }
      msg_id = prop;
      color = d.color;
      msg = d.msg;
      clearTimeout(timeout_id);
      timeout_id = setTimeout(() => {
        person_id = undefined;
        msg_id = undefined;
        msg = undefined;
      }, show_time); 
    });
  }
</script>

{#if msg_id}
  <li
    class="list-group-item pt-0 pb-0 ps-2 bg-{color}"
  >
  <div class="row ps-0">
    <div class="col-md-1 b-gate ms-0">
      <h3>POORT</h3>
    </div>
    <div class="col-md pt-2 pb-2">
      {#if person_id}
        <PersonTag {person_id} show_member_year />
      {/if}
      <Badge color=dark>
        {#if msg_id === 'person_already_registered'}
          Reeds geregistreerd om {get_time_str(sub_person_last_reg_ts_map.get(person_id))}
          (binnen {Math.floor(reg_block_time / 60000)} minuten).
        {:else}
          {msg}
        {/if}
      </Badge>
    </div>
  </div>
  </li>
{/if}

<style>
li {
  border-bottom:  1px solid lightgrey;
}
div.b-gate{
  background-color: #040;
  border-right: 1px solid lightgrey;
}
h3 {
  font-size: .8em;
  line-height: 2em;
}
</style>
