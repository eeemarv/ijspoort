<script>
  import { Button } from 'sveltestrap';
  import TagCount from './TagCount.svelte';
  import TagModal from './TagModal.svelte';

  let open;
  let tag_count = 0;
  let type_count = 0;
</script>

<TagModal bind:open />

<TagCount
  bind:tag_count
  bind:type_count
/>

<Button
  on:click={() => open = true}
  color=accent
  size=sm
  title="Totaal {tag_count} tags en {type_count} tag types."
>
  {tag_count.toString()} / {type_count.toString()}
</Button>