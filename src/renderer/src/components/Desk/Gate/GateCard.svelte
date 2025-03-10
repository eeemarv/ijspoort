<script>
  import { Card, CardHeader } from '@sveltestrap/sveltestrap';
  import GateSens from '../../Gate/GateSens.svelte';
  import GateGraphModal from '../GateGraph/GateGraphModal.svelte';
  import GateAlert from './GateAlert.svelte';
  import GateBadge from '../../Gate/GateBadge.svelte';

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