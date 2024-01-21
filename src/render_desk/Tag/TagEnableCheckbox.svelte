<script>
  import Checkbox from '../../render/Common/Checkbox.svelte';
  import { tag_types_enabled } from '../../services/store';

  export let type_id;

  let checked = $tag_types_enabled[type_id] ?? false;

  $: $tag_types_enabled[type_id] = checked;

</script>

<Checkbox
  bind:checked
  name={type_id}
>
  <slot></slot>
</Checkbox>
