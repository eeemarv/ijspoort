<script>
  import { tag_type_table } from "../services/store";
  import TagType from "./TagType.svelte";

  export let type_id = undefined;

  $: tag = $tag_type_table[type_id] ?? {};

</script>

<TagType {tag} />
