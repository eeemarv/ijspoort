<script>
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import { tag_add } from '../../db_put/tag_put';
  import { Button } from 'sveltestrap';
  import { selected_person_id } from '../../services/store';
  import { tag_type_map } from '../../services/store';
  import { person_tag_map } from '../../services/store';

  export let type_id = undefined;

  $: disabled = !$selected_person_id
    || !$tag_type_map.has(type_id)
    || $tag_type_map.get(type_id).max_per_person < 1
    || ($person_tag_map.has($selected_person_id)
      && $person_tag_map.get($selected_person_id).has(type_id)
      && ($person_tag_map.get($selected_person_id).get(type_id).size 
        >= $tag_type_map.get(type_id).max_per_person));

  const handle_add = () => {
    if (type_id && $selected_person_id){
      tag_add(type_id, $selected_person_id);
    }
  };
</script>

<Button
  size=sm
  color=success
  title="Tag toevoegen"
  on:click={handle_add}
  {disabled}
>
  <Icon icon={plusIcon} />
</Button>
