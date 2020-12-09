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

  let person;



  const handleSelectPerson = ((event) => {
    person = event.detail.person;
  });
  const handleDeselectPerson = (() => {
    person = undefined;
  });
  const handleRegisterPerson = (() => {
    // register
    person = undefined;
  });

</script>

<RegExport/>

<Container fluid=true>
  <Row class=vh-100>
    <Col md=9 class=vh-100>
      <ManualInput on:select_person={handleSelectPerson}/>
      <Person {person}
        on:deselect_person={handleDeselectPerson}
        on:register_person={handleRegisterPerson}
        />
      <RegList/>
    </Col>

    <Col class="bg-primary h-100">
      <EID/>
      <NFC/>
      <GateKeeper/>
      <div class=m-3>
        <Stats/>
        <Clock/>
      </div>
    </Col>
  </Row>
</Container>