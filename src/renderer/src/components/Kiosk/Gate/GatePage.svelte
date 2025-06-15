<script>
  import { Col, Container, Row } from '@sveltestrap/sveltestrap';
  import Clock from '../../Common/Clock.svelte';
  import SyncBadge from '../../Common/SyncBadge.svelte';
  import GateCounterRow from '../GateCounter/GateCounterRow.svelte';
  import NfcCountBadge from '../Nfc/NfcCountBadge.svelte';
  import NfcDeviceBadge from '../Nfc/NfcDeviceBadge.svelte';
  import { gate_count_enabled } from '../../../services/store';
  import { temperature_card_enabled } from '../../../services/store';
  import GateModal from '../GateModal/GateModal.svelte';
  import TemperatureCard from '../../Common/TemperatureCard.svelte';
  import { gate_open } from '../../../services/store';
  import { listen_gate_triggers } from '../../../gate/gate_trigger';
  import GateSens from '../../Gate/GateSens.svelte';
  import GateBadge from '../../Gate/GateBadge.svelte';

  listen_gate_triggers();

</script>

<GateModal />

<Container fluid class=vh-100>
  {#if $gate_count_enabled}
    <GateCounterRow />
  {:else}
    <div class="row h-75" class:bg-success={$gate_open}>
      <Col class="h-100 d-flex justify-content-center align-items-center" >
        <Clock font_size=8em />
      </Col>
    </div>
  {/if}

  <Row class="h-25 bg-primary">
    {#if $temperature_card_enabled}
      <Col md=3 class="h-100 d-flex justify-content-center align-items-center">
        <TemperatureCard font_size=.9em />
      </Col>
      <Col md=2 class="h-100 d-flex justify-content-center align-items-center">
        {#if $gate_count_enabled}
          <Clock font_size=1.5em />
        {/if}
      </Col>
    {:else}
      <Col md=5 class="h-100 d-flex justify-content-center align-items-center">
        {#if $gate_count_enabled}
          <Clock font_size=3em />
        {/if}
      </Col>
    {/if}
    <Col class="h-100 p-3 d-flex flex-column">
      <div class="h-50">
        <GateBadge />
        <GateSens />
      </div>
      <div class="h-50 d-flex justify-content-right">
        <div class=me-2>
          <NfcDeviceBadge font_size=1em/>
          <NfcCountBadge font_size=1em />
        </div>
        <SyncBadge font_size=1em />
      </div>
    </Col>
  </Row>
</Container>

<style>
:global(body) {
  overflow: auto;
}
</style>
