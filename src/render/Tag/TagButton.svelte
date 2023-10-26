<script>
  import { tag_type_table } from "../services/store";
  import TagTypeButton from "./TagTypeButton.svelte";

  export let type_id = undefined;

  let tag = {};

  $: {
    $tag_type_table;
    if (type_id){
      tag = $tag_type_table[type_id] ?? {};
    } else {
      tag = {};
    }
  }
</script>

<TagTypeButton {tag} />
