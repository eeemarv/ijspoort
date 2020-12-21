<script>

  import MainPage from './MainPage.svelte';
  import { Container, Row } from 'sveltestrap';
  import { db_reg } from './../services/pouchdb';
  import { person, gate_keeper, nfc_uid } from './../services/store';

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

  const handle_register_by_manual = (() => {
    add_reg($person, 'manual');
    $person = undefined;
  });
  const handle_register_by_nfc = ((event) => {
    $person = undefined;
    add_reg(event.detail.person, 'nfc');
  });

</script>

<Container fluid=true>
    <Row class=vh-100>
        <MainPage
            on:register_by_manual={handle_register_by_manual}
            on:register_by_nfc={handle_register_by_nfc}
            {blocked_reg}
        />
    </Row>
</Container>
