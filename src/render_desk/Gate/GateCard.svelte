<script>
  import { Card, CardHeader } from 'sveltestrap';
  import GateSens from '../../render/Gate/GateSens.svelte';
  import GateGraphModal from '../GateGraph/GateGraphModal.svelte';
  import GateAlert from './GateAlert.svelte';
  import GateBadge from '../../render/Gate/GateBadge.svelte';

  let open_graph_modal;

</script>

<GateGraphModal bind:open_graph_modal />

<Card class=my-2>
  <CardHeader>
    <GateBadge 
      font_size=.9em
      on:click={open_graph_modal}   
    />

    <GateSens
      font_size=.9em
      on:click={open_graph_modal} 
    />
  </CardHeader>
  <GateAlert />
</Card>