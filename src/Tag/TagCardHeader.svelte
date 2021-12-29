<script>
  import { Button } from 'sveltestrap';
  import { tag_total_count } from '../services/store';
  import { tag_type_count } from '../services/store';
  import TagModal from './TagModal.svelte';

  let open;
</script>

<TagModal bind:open />

<div class="card-header py-2 d-flex w-100 justify-content-between">
  <div>
    Tags
  </div>
  <div>
    <Button
      on:click={() => open = true}
      color=accent
      size=sm
      title="Totaal {$tag_total_count} tags en {$tag_type_count} tag types."
    >
      {$tag_total_count.toString()} / {$tag_type_count.toString()}
    </Button>
  </div>
</div>
