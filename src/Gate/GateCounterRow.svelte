<script>
  import { Col } from 'sveltestrap';
import GateCounter from './GateCounter.svelte';
import GateCounterMax from './GateCounterMax.svelte';
import GateCounterOutLimit from './GateCounterOutLimit.svelte';
import GateCounterStatus from './GateCounterStatus.svelte';

</script>

<div class="row h-75" class:bg-danger={true}>
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
      <GateCounterMax />
    </div>
  </Col>
</div>
