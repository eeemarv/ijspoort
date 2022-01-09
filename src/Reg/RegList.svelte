<script>
  import { Row, Col, ListGroup, ListGroupItem } from 'sveltestrap';
  import RegItem from './RegItem.svelte';
  import { db_reg, db_tag } from '../services/db';
  import { tag_type_enabled_sorted_id_ary, tag_types } from '../services/store';
  import { onMount } from 'svelte';

  const reg_hours = 5;
  const reg_limit = 1000;
  const refresh_interval = 10000;

  let registrations = [];
  let blocked_regs = [];
  let person_tags = {};

  export let block_time = 300000;

  export const add_person_already_registered = (reg) => {
    blocked_regs = [reg, ...blocked_regs];
  };

  const get_key_since = () => {
    let epoch = (new Date()).getTime();
    return 't' + (epoch - (3600000 * reg_hours)).toString();
  }

  const get_tags_for_person_ids = (person_ids) => {
    let tag_search_keys = [];
    Object.keys(person_ids).forEach((p_id) => {
      $tag_type_enabled_sorted_id_ary.forEach((tid) => {
        tag_search_keys = [...tag_search_keys, tid + '_' + p_id];
      });
    });
    console.log('get_tags_for_person_ids() tag_search_keys');
    console.log(tag_search_keys);
    db_tag.query('search/count_by_type_id_and_person_id', {
      keys: tag_search_keys,
      include_docs: false,
      reduce: true,
      group: true
    }).then((res) => {
      console.log('get_tags_for_person_ids() res');
      console.log(res);
      let p_tag_types = {};
      res.rows.forEach((r) => {
        let rparts = r.key.split('_');
        let tag_type_id = rparts[0] + '_' + rparts[1];
        let p_id = rparts[2];
        if (typeof p_tag_types[p_id] !== 'object'){
          p_tag_types[p_id] = [];
        }
        for (let i = 0; i < r.value; i++){
          p_tag_types[p_id] = [...p_tag_types[p_id], tag_type_id];
        }
      });
      Object.keys(p_tag_types).forEach((prsn_id) => {
        person_tags[prsn_id] = p_tag_types[prsn_id];
      });
    }).catch((err) => {
      console.log('get_tags_for_person() err');
      console.log(err);
    });
  };

  const refresh_reg_list = () => {
    db_reg.allDocs({
      include_docs: true,
      limit: reg_limit,
      endkey: get_key_since(),
      descending: true
    }).then((res) => {
      console.log('refresh reg_list');
      console.log(res);
      let regs = [];
      let person_ids = {};
      res.rows.forEach((v) => {
        regs = [...regs, v.doc];
        person_ids[v.doc.person_id] = true;
      });
      get_tags_for_person_ids(person_ids);
      registrations = regs;
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
        registrations = registrations.filter((reg) => reg._id !== change.id);
        return;
      }
      if (change.id < get_key_since()){
        console.log('change too old, do no display >', change.id);
        return;
      }
      let person_ids = {};
      person_ids[change.doc.person_id] = true;
      get_tags_for_person_ids(person_ids);
      registrations = [change.doc, ...registrations];
    }).on('error', (err) => {
      console.log(err);
    });
  });

  $: {
    $tag_type_enabled_sorted_id_ary;
    $tag_types;
    refresh_reg_list();
  }

  setInterval(() => {
    refresh_reg_list();
  }, refresh_interval);
</script>

<Row>
  <Col class=h-100>
    <ListGroup>
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
      {#each registrations as reg, index(reg._id)}
        <RegItem
        reg_index={registrations.length - index}
        {reg}
        tags={person_tags[reg.person_id] ?? []}
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
