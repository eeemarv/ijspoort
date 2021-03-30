<script>
  import { Row, Col, ListGroup, ListGroupItem } from 'sveltestrap';
  import RegItem from './RegItem.svelte';
  import { db_reg } from '../services/db';
  import { onMount } from 'svelte';

  const reg_hours = 5;
  const reg_limit = 1000;
  const refresh_interval = 10000;

  let registrations = [];
  let blocked_regs = [];

  export let block_time = 300000;

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
      if (change.id < get_key_since()){
        console.log('change too old, do no display >', change.id);
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
                {block_time}
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
