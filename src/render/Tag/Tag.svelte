<script>
  import { tag_type_map } from "../services/store";
  import TagType from "./TagType.svelte";

  export let type_id = undefined;

</script>

<TagType tag={$tag_type_map.get(type_id)} />
