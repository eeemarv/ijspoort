<script>
  import { Col, Container, Row } from 'sveltestrap';
  import Clock from './Clock.svelte';

</script>

<Container fluid=true class="h-100">
  <Row class="h-75">
    <Col>
      <Clock />
    </Col>
  </Row>
  <Row class="h-25">
    <Col>
      <Clock />
    </Col>
  </Row>
</Container>
