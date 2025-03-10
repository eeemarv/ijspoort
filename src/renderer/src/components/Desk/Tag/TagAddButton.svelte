<script>
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import { tag_add_bulk } from '../../../db_put/tag_put';
  import { Button } from 'sveltestrap';
  import { desk_selected_person_id } from '../../../services/store';
  import { tag_type_map } from '../../../services/store';
  import { person_tag_map } from '../../../services/store';

  export let type_id = undefined;
  let disabled = true;

  $: if (!$desk_selected_person_id || !type_id){
    disabled = true;
  } else if (!$tag_type_map.has(type_id)){
    disabled = true;
  } else if ($tag_type_map.get(type_id).max_per_person < 1){
    disabled = true;
  } else if ($person_tag_map.has($desk_selected_person_id)){
    if (!$person_tag_map.get($desk_selected_person_id).has(type_id)){
      disabled = false;
    } else if ($person_tag_map.get($desk_selected_person_id).get(type_id).size
      >= $tag_type_map.get(type_id).max_per_person){
        disabled = true;
      } else {
        disabled = false;
      }
  } else {
    disabled = false;
  }
</script>

<Button
  size=sm
  color=success
  title="Tag toevoegen"
  on:click={() => {tag_add_bulk([type_id], $desk_selected_person_id);}}
  {disabled}
>
  <Icon icon={plusIcon} />
</Button>
