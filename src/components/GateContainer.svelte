<script>
  import { Col, Container, Row } from 'sveltestrap';
  import Clock from './Clock.svelte';
import DbSync from './DbSync.svelte';
import GateCounterRow from './GateCounterRow.svelte';
import NfcCountBadge from './NfcCountBadge.svelte';
import NfcDeviceBadge from './NfcDeviceBadge.svelte';

</script>

<Container fluid class=vh-100>
  <GateCounterRow />
  <!--
  <div class="h-75 row" class:bg-danger={true}>
    <Col  class="h-100 d-flex justify-content-center align-items-center" >
      <Clock font_size=20em />
    </Col>

    <Col class=h-66>
      <div class="full h-100">
        VOL
      </div>
    </Col>

  </div>
-->
  <Row class="h-25 bg-primary">
    <Col md=6 class="h-100 d-flex justify-content-center align-items-center">
      <Clock font_size=8em />
      <!--
      <span clas=mr-3>&nbsp;</span>
      <GateLocaleDate />
      -->
    </Col>
    <Col class="h-100 p-3 d-flex flex-column">
      <div class="h-50">
        <span class="badge badge-dark">Oufti</span>
      </div>
      <div class="h-50 d-flex justify-content-right">
        <div class=mr-2>
          <NfcDeviceBadge />
          <NfcCountBadge font_size=2em />
        </div>
        <DbSync font_size=2em />
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
