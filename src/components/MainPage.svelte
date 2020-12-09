<script>
  import { Container, Row, Col, Badge } from 'sveltestrap';
  import ManualInput from './ManualInput.svelte';
  import Person from './Person.svelte';
  import RegList from './RegList.svelte';
  import EID from './EID.svelte';
  import NFC from './NFC.svelte';
  import RegExport from './RegExport.svelte';
  import GateKeeper from './GateKeeper.svelte';
  import Stats from './Stats.svelte';
  import Clock from './Clock.svelte';

  const handleRegisterByManual = (() => {
    // register
    person = undefined;
  });
  const handleRegisterByNFC = (() => {

  });

</script>

<RegExport/>

<Container fluid=true>
  <Row class=vh-100>
    <Col md=9 class=vh-100>
      <ManualInput/>
      <Person
        on:register_by_manual={handleRegisterByManual}
        />
      <RegList/>
    </Col>

    <Col class="bg-primary h-100">
      <EID/>
      <NFC
        on:register_by_nfc={handleRegisterByNFC}
      />
      <GateKeeper/>
      <div class=m-3>
        <Stats/>
        <Clock/>
      </div>
    </Col>
  </Row>
</Container>