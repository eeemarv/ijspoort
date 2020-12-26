<script>
  import { Row, Col, ListGroup, ListGroupItem, Badge } from 'sveltestrap';
  import RegItem from './RegItem.svelte';
  import { db_reg } from '../services/db';
  import { onMount } from 'svelte';
  import { nfc_uid } from './../services/store';

  const reg_hours = 5;
  const reg_limit = 1000;
  const refresh_interval = 60000;
  const block_time = 300000; // 5 minutes

  let registrations = [];
  let blocked_regs = [];

  export const add_reg = (person, source) => {
    let now = new Date();
    let reg = {
        _id: 't' + now.getTime().toString(),
        ts_epoch: now.getTime(),
        person_id: person._id
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
        blocked_regs = [reg, ...blocked_regs];
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

  export const add_blocked_reg = (reg) => {
    blocked_regs = [reg, ...blocked_regs];
  };

  const get_key_since = () => {
    let epoch = (new Date()).getTime();
    return 't' + (epoch - (3600000 * reg_hours)).toString();
  }

  const refresh_reg_list = () => {
    db_reg.allDocs({
      include_docs: true,
      limit: reg_limit,
      endkey: get_key_since(),
      descending: true
    }).then((res) => {
      console.log(res);
      registrations = res.rows;
    }).catch((err) => {
      console.log(err);
    });
  };

  onMount(() => {
    refresh_reg_list();

    db_reg.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      console.log('reg change');
      console.log(change);
      if (change.deleted){
        registrations = registrations.filter((reg) => reg.doc._id !== change.id);
        return;
      }
      change._id = change.id;
      registrations = [change, ...registrations];
    }).on('error', (err) => {
      console.log(err);
    });
  });

  setInterval(() => {
    refresh_reg_list();
  }, refresh_interval);
</script>

<Row>
    <Col class=h-100>
        <ListGroup class="list-group-scroll list-group-striped list-group-border-bottom" id="reg_list">
            <ListGroupItem>
                <p><br></p>
            </ListGroupItem>
            {#each blocked_regs as blocked_reg(blocked_reg._id)}
                <RegItem
                reg={blocked_reg}
                blocked={true}
                />
            {/each}
            {#each registrations as reg, index(reg.doc._id)}
                <RegItem
                reg_index={registrations.length - index}
                reg={reg.doc}
                />
            {/each}
            {#if registrations.length === 0}
                <ListGroupItem class=bg-primary>
                    <p>Nog geen registraties</p>
                </ListGroupItem>
            {/if}
        </ListGroup>
    </Col>
</Row>
