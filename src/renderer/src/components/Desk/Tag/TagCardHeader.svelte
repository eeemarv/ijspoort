<script>
  import { Button } from '@sveltestrap/sveltestrap';
  import { tag_map } from '../../../services/store';

  $: total_count = [...$tag_map.values()].reduce((acc, t_map) => acc + t_map.size, 0);

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
      title="Totaal {total_count} tags en {$tag_map.size} tag types."
    >
      {total_count} / {$tag_map.size}
    </Button>
  </div>
</div>
