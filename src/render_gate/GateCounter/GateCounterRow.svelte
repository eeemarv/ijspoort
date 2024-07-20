<script>
  import { Col } from 'sveltestrap';
  import { gate_count } from '../../services/store';
  import { members_only_enabled } from '../../services/store';
  import { gate_open } from '../../services/store';
  import GateCounter from './GateCounter.svelte';
  import GateCounterOutLimit from './GateCounterOutLimit.svelte';
  import GateCounterStatus from './GateCounterStatus.svelte';

</script>

{#if $gate_count > 0}
  <div class="row h-75" class:bg-success={$members_only_enabled && $gate_open}>
    <Col class="h-100 d-flex justify-content-center align-items-center" >
      <GateCounter font_size=16em />
    </Col>
  </div>
{:else}
  <div class="row h-75 bg-danger">
    <Col md=9 class="h-100 d-flex justify-content-center align-items-center" >
      <GateCounter />
    </Col>
    <Col class="d-flex flex-column justify-content-between">
      <div class="h-50 d-flex align-items-center">
        <GateCounterStatus />
      </div>
      <div class=h-25>
        <GateCounterOutLimit />
      </div>
      <div class=h-25>
      </div>
    </Col>
  </div>
{/if}
