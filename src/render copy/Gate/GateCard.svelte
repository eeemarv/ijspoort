<script>
  import { Card, CardHeader } from 'sveltestrap';
  import GateSens from './GateSens.svelte';
  import GateGraphModal from '../GateGraph/GateGraphModal.svelte';

  let open_graph_modal;

</script>

<GateGraphModal bind:open_graph_modal />

<Card class=my-2>
  <CardHeader>
    <div class="d-flex w-100 justify-content-between">
      <div>
        Poort
      </div>
      <div>
        <GateSens on:click={open_graph_modal} />
      </div>
    </div>
  </CardHeader>
</Card>