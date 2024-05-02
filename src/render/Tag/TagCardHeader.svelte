<script>
  import { Button } from 'sveltestrap';
  import { tag_count_map } from '../services/store';

</script>

<div class="card-header py-2 d-flex w-100 justify-content-between">
  <div>
    Tags
  </div>
  <div>
    <Button
      on:click
      color=accent
      size=sm
      title="Totaal {[...$tag_count_map.values()].reduce((acc, a) => acc + a, 0)} tags en {$tag_count_map.size} tag types."
    >
      {[...$tag_count_map.values()].reduce((acc, a) => acc + a, 0)} / {$tag_count_map.size}
    </Button>
  </div>
</div>
