<script>
  import { Button } from 'sveltestrap';
  import { tag_count_table } from '../services/store';

  let total_count = 0;
  let type_count = 0;

  $: {
    type_count = Object.keys($tag_count_table).length;
    total_count = Object.values($tag_count_table).reduce((acc, val) => acc + val, 0);
  }
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
      title="Totaal {total_count} tags en {type_count} tag types."
    >
      {total_count} / {type_count}
    </Button>
  </div>
</div>
