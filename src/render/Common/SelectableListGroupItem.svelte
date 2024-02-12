<script>
  import { createEventDispatcher } from 'svelte';
  import { get_random_str } from '../../services/functions';
  import { Popover } from 'sveltestrap';

  export let active = false;
  export let id = get_random_str(6);
  export let selectable = true;

  const dispatch = createEventDispatcher();

  const handle_click = (e) => {
    if (!selectable){
      return;
    }
    dispatch('click', e.detail);
  };

</script>

<div
  class=list-group-item
  class:active
  class:selectable
  on:click={handle_click}
  on:keyup={() => {}}
  {id}
>
  <slot />
</div>

{#if selectable && $$slots.popover}
<Popover
  placement=bottom
  target={id}
  hideOnOutsideClick
  dismissible
  trigger=click
>
  <slot name=popover_title slot=title />
  <slot name=popover />
</Popover>
{/if}

<style>
.selectable {
  cursor: pointer;
}
.selectable:hover {
  background-color: rgb(59, 59, 59);
}
.selectable.active:hover {
  background-color: rgb(44, 106, 141);
}
</style>
