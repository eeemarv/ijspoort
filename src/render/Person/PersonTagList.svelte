<script>
  import { tag_person_sorted_ary } from '../services/store';
  import PersonTagListItem from './PersonTagListItem.svelte';

</script>

{#each $tag_person_sorted_ary as tag(tag._id)}
  <PersonTagListItem {tag} />
{/each}