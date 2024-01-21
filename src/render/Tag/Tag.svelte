<script>
  import { tag_type_map } from '../../services/store';
  import TagSpan from './TagSpan.svelte';

  export let type_id = undefined;
</script>

<TagSpan tag={$tag_type_map.get(type_id)} />
