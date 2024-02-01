<script>
  import { sub_nfc_map, sub_person_last_reg_ts_map } from '../../services/sub';
  import { ev_nfc_scan } from '../../services/events';
  import PersonTag from '../../render/Person/PersonTag.svelte';
  import { Badge } from 'sveltestrap';
  import { reg_block_time } from '../../db_put/reg_put';
  import { get_time_str } from '../../services/functions';

  let timeout_id = undefined;
  const show_time = 3000;
  let person_id = undefined;

  ev_nfc_scan.addEventListener('person_already_registered', (e) => {
    if (typeof e.detail.nfc_id !== 'string'){
      return;
    }
    if (!sub_nfc_map.has(e.detail.nfc_id)){
      return;
    }
    const prsn_id = sub_nfc_map.get(e.detail.nfc_id).person_id;
    if (!sub_person_last_reg_ts_map.has(prsn_id)){
      return;
    }
    clearTimeout(timeout_id);
    timeout_id = setTimeout(() => {
      person_id = undefined;
    }, show_time);
    person_id = prsn_id;  
  });
</script>

{#if person_id}
  <li class="list-group-item bg-purple">
    <PersonTag {person_id} show_member_year />
    <Badge color=dark>
      Reeds geregistreerd om {get_time_str(sub_person_last_reg_ts_map.get(person_id))}<br/>
      (binnen {Math.floor(reg_block_time / 60000)} minuten)
    </Badge>
  </li>
{/if}

<style>
li {
  border-bottom:  1px solid lightgrey;
}
</style>
