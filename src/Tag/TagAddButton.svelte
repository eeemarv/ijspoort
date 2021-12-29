<script>
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import { tag_add } from '../services/tag';
  import { onMount } from 'svelte';
  import { Button } from 'sveltestrap';
  import { person } from '../services/store';
  import { tag_types } from '../services/store';
  import { tag_person_count_by_type } from '../services/store';

  export let tag_type_id;
  let handle_add;
  let disabled = true;

  $: disabled = !$person
    || $tag_types[tag_type_id].max_per_person <= $tag_person_count_by_type[tag_type_id];

  onMount(() => {
    handle_add = () => {
      tag_add(tag_type_id, $person._id);
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
