<script>
  import { Badge } from 'sveltestrap';
  import PersonTag from '../../render/Person/PersonTag.svelte';
  import { reg_block_time } from '../../db_put/reg_put';
  import { sub_person_last_reg_ts_map, sub_reg_map } from '../../services/sub';
  import { get_time_str } from '../../services/functions';

  export let person_id = undefined;
</script>

{#if person_id}
  <div>
    <PersonTag {person_id} show_member_year show_tags />
    <Badge color=dark>
      Reeds geregistreerd om {get_time_str(sub_person_last_reg_ts_map.get(person_id))} <br/>
      (binnen {Math.floor(reg_block_time / 60000)} minuten).
    </Badge>
  </div>
{/if}


