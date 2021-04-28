<script>
  import { Col, Container, Row } from 'sveltestrap';
  import Clock from '../Common/Clock.svelte';
  import DbSync from '../Db/DbSync.svelte';
  import GateCounterRow from './GateCounterRow.svelte';
  import NfcCountBadge from '../Nfc/NfcCountBadge.svelte';
  import NfcDeviceBadge from '../Nfc/NfcDeviceBadge.svelte';
import GateStatus from './GateStatus.svelte';
import GateSensIn from './GateSensIn.svelte';
import GateSensOut from './GateSensOut.svelte';

</script>

<Container fluid class=vh-100>
  <GateCounterRow />

  <Row class="h-25 bg-primary">
    <Col md=6 class="h-100 d-flex justify-content-center align-items-center">
      <Clock font_size=8em />
    </Col>
    <Col class="h-100 p-3 d-flex flex-column">
      <div class="h-50">
        <GateStatus />
        <!--
        <GateSensIn />
        <GateSensOut />
        -->
      </div>
      <div class="h-50 d-flex justify-content-right">
        <div class=mr-2>
          <NfcDeviceBadge />
          <NfcCountBadge font_size=1.5em />
        </div>
        <DbSync font_size=1.5em />
      </div>
    </Col>
  </Row>
</Container>

<style>
:global(body) {
  user-zoom: none;
  user-select: none;
}
</style>
