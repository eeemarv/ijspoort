

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
  import { db_reg } from './../services/pouchdb';
  import { person, gate_keeper, nfc_uid } from './../services/store';
  import { onMount } from 'svelte';

  const add_reg = (person, source) => {
    let now = new Date();
    let reg = {
        _id: 't' + now.getTime().toString(),
        ts_epoch: now.getTime(),
        person: person,
        person_id: person._id,
        gate_keeper: $gate_keeper,
        gate_keeper_id: $gate_keeper?._id
    };
    if (source === 'manual'){
      reg.manual = true;
    }
    if (source === 'nfc'){
      reg.nfc_uid = $nfc_uid;
    }
    db_reg.put(reg).then((res) => {
      console.log('add_reg');
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  };

  const handleRegisterByManual = (() => {
    add_reg($person, 'manual');
    $person = undefined;
  });
  const handleRegisterByNFC = ((event) => {
    $person = undefined;
    add_reg(event.detail.person, 'nfc');
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