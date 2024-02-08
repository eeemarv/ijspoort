<script>
  import { Badge, Card, CardHeader } from 'sveltestrap';
  import GateSens from '../../render/Gate/GateSens.svelte';
  import GateGraphModal from '../GateGraph/GateGraphModal.svelte';
  import { gate_open } from '../../services/store';
  import GateAlert from './GateAlert.svelte';

  let open_graph_modal;

</script>

<GateGraphModal bind:open_graph_modal />

<Card class=my-2>
  <CardHeader>
    <div class="d-flex w-100 justify-content-between">
      <div>
        <Badge color="{$gate_open ? 'success' : 'dark'}">
          Poort
        </Badge>
      </div>
      <div>
        <GateSens on:click={open_graph_modal} />
      </div>
    </div>
  </CardHeader>
  <GateAlert />
</Card>