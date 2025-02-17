<script>
  import { createEventDispatcher } from 'svelte';

  export let active = false;
  export let id = undefined;
  export let selectable = true;

  const dispatch = createEventDispatcher();

  const handle_click = (e) => {
    if (!selectable){
      return;
    }
    dispatch('click', e.detail);
  };

</script>
{#if selectable}
<a
  class="list-group-item list-group-item-action"
  class:active
  on:click={handle_click}
  on:keyup
  tabindex=-1
  {id}
>
  <slot />
</a>
{:else}
<div class=list-group-item
  class:active
>
  <slot />
</div>
{/if}

<style>

a {
  cursor: pointer;
}
/*
.selectable:hover {
  background-color: rgb(59, 59, 59);
}
.selectable.active:hover {
  background-color: rgb(44, 106, 141);
}
*/
</style>
