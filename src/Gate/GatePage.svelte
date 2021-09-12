<script>
  import { Col, Container, Row } from 'sveltestrap';
  import Clock from '../Common/Clock.svelte';
  import DbSync from '../Db/DbSync.svelte';
  import GateCounterRow from './GateCounterRow.svelte';
  import NfcCountBadge from '../Nfc/NfcCountBadge.svelte';
  import NfcDeviceBadge from '../Nfc/NfcDeviceBadge.svelte';
  import GateStatus from './GateStatus.svelte';
  import { gate_count_enabled } from '../services/store';
  import NfcGate from '../Nfc/NfcGate.svelte';
  import GateConfig from './GateConfig.svelte';
  import { onMount } from 'svelte';

  let gate_config;
  let gate_status;
  let handle_launch_gate_config;
  let handle_close_gate_config;
  let handle_open_gate_by_nfc;

  onMount(() => {
    handle_launch_gate_config = (event) => {
      gate_config.launch();
    };

    handle_close_gate_config = (event) => {
      gate_config.close();
    };

    handle_open_gate_by_nfc = (event) => {
      gate_status.open_gate_by_nfc(event.detail.person);
    };
  });
</script>

<NfcGate
  on:launch_gate_config={handle_launch_gate_config}
  on:close_gate_config={handle_close_gate_config}
  on:trigger_open_gate={handle_open_gate_by_nfc}
/>

<GateConfig bind:this={gate_config} />

<Container fluid class=vh-100>
  {#if $gate_count_enabled}
    <GateCounterRow />
  {:else}
    <div class="row h-75">
      <Col class="h-100 d-flex justify-content-center align-items-center" >
        <Clock font_size=8em />
      </Col>
    </div>
  {/if}

  <Row class="h-25 bg-primary">
    <Col md=6 class="h-100 d-flex justify-content-center align-items-center">
      {#if $gate_count_enabled}
        <Clock font_size=3em />
      {/if}
    </Col>
    <Col class="h-100 p-3 d-flex flex-column">
      <div class="h-50">
        <GateStatus bind:this={gate_status} />
      </div>
      <div class="h-50 d-flex justify-content-right">
        <div class=me-2>
          <NfcDeviceBadge />
          <NfcCountBadge font_size=1.3em />
        </div>
        <DbSync font_size=1.3em />
      </div>
    </Col>
  </Row>
</Container>

<style>
:global(body) {
  overflow: auto;
}
</style>
