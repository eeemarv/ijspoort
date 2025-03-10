<script>
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import Icon from '@iconify/svelte';
  import timesIcon from '@iconify/icons-fa/times';
  import { getContext } from 'svelte';
  import { tag_map } from '../../../services/store';
  import { tag_type_del } from '../../../db_put/tag_put';

  const { setActiveTab } = getContext('tabContent');
  const dispatch = createEventDispatcher();
  export let type_id = undefined;

  const show_del_time = 1000;

  const handle_click = () => {
    dispatch('del', type_id);
    setActiveTab('type_list');
    setTimeout(() => {
      tag_type_del(type_id);
    }, show_del_time);
  };
</script>

{#if !$tag_map.has(type_id) || $tag_map.get(type_id).size === 0}
  <Button
    color=danger
    title="tag type verwijderen"
    on:click={handle_click}
  >
    <Icon icon={timesIcon} />
  </Button>
{/if}