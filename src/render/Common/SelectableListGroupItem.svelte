<script>
  import { createEventDispatcher } from 'svelte';
  import { get_random_str } from '../../services/functions';

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
