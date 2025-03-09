<script>
  import Checkbox from '../../Common/Checkbox.svelte';
  import { desk_tag_types_enabled } from '../../services/store';

  export let type_id;

  let checked = $desk_tag_types_enabled[type_id] ?? false;

  $: $desk_tag_types_enabled[type_id] = checked;

</script>

<Checkbox
  bind:checked
  name={type_id}
>
  <slot></slot>
</Checkbox>
