<script>
  import { Container, Row, Col, Badge } from 'sveltestrap';
  import ManualInput from './ManualInput.svelte';
  import SelectedPerson from './SelectedPerson.svelte';
  import RegList from './RegList.svelte';
  import EID from './EID.svelte';
  import NFC from './NFC.svelte';
  import RegExport from './RegExport.svelte';
</script>

<RegExport/>

<Container fluid=true>
  <Row class=vh-100>
    <Col md=9 class=vh-100>
      <ManualInput/>
      <SelectedPerson/>
      <RegList/>
    </Col>

    <Col class="bg-primary h-100">
      <Row class=h-25>
        <Col>
            <EID/>
            <NFC/>
        </Col>
      </Row>

      <Row class=h-25>
        <Col>
        </Col>
      </Row>

      <Row class=h-25>
        <Col>
        </Col>
      </Row>

      <Row class=h-25>
        <Col class=p-5>
            <h1>ijspoort</h1>
        </Col>
      </Row>

    </Col>
  </Row>
</Container>