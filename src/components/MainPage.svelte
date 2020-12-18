

<script>
  import { Container, Row, Col } from 'sveltestrap';
  import ManualInput from './ManualInput.svelte';
  import Person from './Person.svelte';
  import RegList from './RegList.svelte';
  import EID from './EID.svelte';
  import NFC from './NFC.svelte';
  import RegCSVExport from './RegCSVExport.svelte';
  import GateKeeper from './GateKeeper.svelte';
  import Stats from './Stats.svelte';
  import Clock from './Clock.svelte';
  import { db_reg } from './../services/pouchdb';
  import { person, gate_keeper, nfc_uid } from './../services/store';
  import DbJSONExport from './DbJSONExport.svelte';

  const block_time = 300000; // 5 minutes
  let blocked_reg = undefined;

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

    db_reg.query('search/by_person_id_and_ts_epoch', {
      startkey: person._id + '_' + (reg.ts_epoch - block_time).toString(),
      endkey: person._id + '_\uffff',
      limit: 1
    }).then((res) => {
      console.log('search/by_person_id_and_ts_epoch');
      console.log(res);
      if (res.rows.length > 0){
        blocked_reg = reg;
        setTimeout(() => {
          blocked_reg = undefined;
        }, 1500);
        throw 'person_already_registered';
      }
      return db_reg.put(reg);
    }).then((res) => {
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

<RegCSVExport/>
<DbJSONExport/>

<Container fluid=true>
  <Row class=vh-100>
    <Col md=9 class=vh-100>
      <ManualInput/>
      <Person
        on:register_by_manual={handleRegisterByManual}
        />
      <RegList {blocked_reg}/>
    </Col>

    <Col class="bg-primary h-100">
      <EID/>
      <NFC
        on:register_by_nfc={handleRegisterByNFC}
      />
      <div class=m-3>
        <Stats/>
        <Clock/>
      </div>
    </Col>
  </Row>
</Container>