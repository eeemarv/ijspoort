<script>
  import { Col, Container, Row } from 'sveltestrap';
  import Clock from '../../render/Common/Clock.svelte';
  import SyncBadge from '../../render/Common/SyncBadge.svelte';
  import GateCounterRow from '../GateCounter/GateCounterRow.svelte';
  import NfcCountBadge from '../Nfc/NfcCountBadge.svelte';
  import NfcDeviceBadge from '../Nfc/NfcDeviceBadge.svelte';
  import GateStatus from './GateStatus.svelte';
  import { gate_count_enabled } from '../../services/store';
  import { temp_display_enabled } from '../../services/store';
  import { gate_nfc_enabled } from '../../services/store';
  import GateModal from '../GateModal/GateModal.svelte';
  import GateConfig from '../GateConfig/GateConfig.svelte';
  import TemperatureCard from '../../render/Common/TemperatureCard.svelte';
  import { onMount } from 'svelte';

  let cmp_gate_config;
  let cmp_gate_status;
  let open_gate;

  let handle_open_gate_by_nfc;
  let handle_close_gate;
  let handle_click_open_gate_config;
  let handle_trigger_close_gate_config;

  onMount(() => {
    handle_open_gate_by_nfc = (e) => {
      cmp_gate_status.open_gate_by_nfc(e.detail.person, e.detail.nfc_uid);
    };

    handle_close_gate = (event) => {
      cmp_gate_status.close_trigger();
    };

    handle_click_open_gate_config = (e) => {
      cmp_gate_status.close_trigger();
      cmp_gate_config.click_open(
        e.detail.person, e.detail.nfc_uid,
        e.detail.config_auth, e.detail.deblock_auth
      );
    }

    handle_trigger_close_gate_config = () => {
      cmp_gate_config.close();
    }
  });
</script>

<GateModal
  on:trigger_open_gate={handle_open_gate_by_nfc}
  {open_gate}
  on:click_open_gate_config={handle_click_open_gate_config}
  on:trigger_close_gate_config={handle_trigger_close_gate_config}
/>

<GateConfig bind:this={cmp_gate_config} />

<Container fluid class=vh-100>
  {#if $gate_count_enabled}
    <GateCounterRow {open_gate} />
  {:else}
    <div class="row h-75" class:bg-success={$gate_nfc_enabled && open_gate}>
      <Col class="h-100 d-flex justify-content-center align-items-center" >
        <Clock font_size=8em />
      </Col>
    </div>
  {/if}

  <Row class="h-25 bg-primary">
    {#if $temp_display_enabled}
      <Col md=3 class="h-100 d-flex justify-content-center align-items-center">
        <TemperatureCard
          font_size=.9em
        />
      </Col>
      <Col md=3 class="h-100 d-flex justify-content-center align-items-center">
        {#if $gate_count_enabled}
          <Clock font_size=2em />
        {/if}
      </Col>
    {:else}
      <Col md=6 class="h-100 d-flex justify-content-center align-items-center">
        {#if $gate_count_enabled}
          <Clock font_size=3em />
        {/if}
      </Col>
    {/if}
    <Col class="h-100 p-3 d-flex flex-column">
      <div class="h-50">
        <GateStatus
          bind:this={cmp_gate_status}
          bind:open={open_gate}
          on:gate_is_open
          on:gate_is_closed
          font_size=1em      />
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
