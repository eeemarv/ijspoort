<script>
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import { tag_add } from '../services/tag';
  import { Button } from 'sveltestrap';

  import { person_tag_map } from '../services/store';
  import { tag_type_map } from '../services/store';
  import { selected_person_id } from '../services/store';

  export let type_id = undefined;

  let disabled = true;

  $:{
    disabled = !$selected_person_id
      || $tag_type_map.get(type_id).max_per_person <= (($person_tag_map.get($selected_person_id) ?? new Map()).get(type_id) ?? new Set()).size;

  }

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
