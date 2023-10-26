<script>
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import { tag_add } from '../services/tag';
  import { onMount } from 'svelte';
  import { Button } from 'sveltestrap';

  import { tag_type_table } from '../services/store';
  import { person_tag_table } from '../services/store';
  import { selected_person_id } from '../services/store';

  export let type_id = undefined;

  let handle_add;
  let disabled = true;

  $: {
    person_tag_count = 100000;
    if ($selected_person_id
      && $person_tag_table[type_id]
      && $person_tag_table[type_id][type_id]){
        person_tag_count = $person_tag_table[type_id][type_id].length;
      }
    disabled = !$selected_person_id
      || $tag_type_table[type_id].max_per_person <= person_tag_count;
  }

  onMount(() => {
    handle_add = () => {
      if (type_id && $selected_person_id){
        tag_add(type_id, $selected_person_id);
      }
    };
  });
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
