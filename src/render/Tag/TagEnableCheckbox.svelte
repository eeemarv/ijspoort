<script>
  import Checkbox from '../Common/Checkbox.svelte';
  import { onMount } from 'svelte';

  import { tag_types_enabled } from '../services/store';

  export let tag_id = undefined;
  let tag_enabled = false;
  let handle_change;

  onMount(() => {
    if (tag_id
      && typeof $tag_types_enabled[tag_id] === 'boolean'
      && $tag_types_enabled[tag_id]){
      tag_enabled = true;
    }

    handle_change = () => {
      setTimeout(() => {
        let t_enabled = $tag_types_enabled;
        if (tag_enabled){
          t_enabled[tag_id] = true;
        } else {
          delete t_enabled[tag_id];
        }
        $tag_types_enabled = t_enabled;
      }, 50);
    };
  });
</script>

<Checkbox
  bind:checked={tag_enabled}
  name={'tag_' + tag_id + '_en'}
  on:change={handle_change}
>
  <slot></slot>
</Checkbox>
