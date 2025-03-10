<script>
  import { Button } from '@sveltestrap/sveltestrap';
  import Icon from '@iconify/svelte';
  import { getContext } from 'svelte';
  import pencilIcon from '@iconify/icons-fa/pencil';
  import { createEventDispatcher } from 'svelte';

  const { setActiveTab } = getContext('tabContent');
  const dispatch = createEventDispatcher();
  export let type_id = undefined;

  const handle_click = () => {
    dispatch('edit', type_id);
    setActiveTab('type_put');
  };
</script>

<Button
  color=primary
  title="tag type aanpassen"
  on:click={handle_click}
  >
  <Icon icon={pencilIcon} />
</Button>