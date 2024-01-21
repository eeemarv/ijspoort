<script>
  import { tag_type_map } from '../../services/store';

  export let type_id = undefined;

  $: tag = $tag_type_map.get(type_id);
</script>

<button
  on:click
  class="badge bg-{tag?.color} me-2"
  title={tag?.description}
>
  {tag?.text}
</button>
