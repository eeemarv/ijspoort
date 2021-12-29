<script>
  import { onMount } from 'svelte';
  import { TabPane, Row, Col } from 'sveltestrap';
  import { ListGroup } from 'sveltestrap';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import Tag from './Tag.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import { tag_types } from '../services/store';
  import { tag_count_by_type } from '../services/store';
  import { person } from '../services/store';
  import { db_tag, db_person } from '../services/db';

  export let tab;
  export let id;

  let list_length = 30;
  let tags = [];
  let persons = {};

  const update = () => {
    let t_tags = [];
    let t_persons = {};

    db_tag.query('search/count_by_type_and_ts_epoch', {
      startkey: id + '_\uffff',
      endkey: id + '_',
      descending: true,
      include_docs: true,
      limit: list_length,
      reduce: false
    }).then((res) => {
      let person_ids = [];
      console.log('tag limit ' + list_length);
      console.log(res);
      res.rows.forEach((v) => {
        t_tags.push(v.doc);
        person_ids.push(v.doc.person_id);
      });
      console.log('person_ids', person_ids);
      return db_person.allDocs({
        keys: person_ids,
        include_docs: true
      });
    }).then((res) => {
      console.log('persons (tag type tab)');
      console.log(res);
      res.rows.forEach((p) => {
        t_persons[p.id] = {...p.doc};
      });
      persons = t_persons;
      tags = t_tags;
    }).catch((err) => {
      console.log(err);
    });
  };

  onMount(() => {
    update();
  });

  $: {
    $tag_count_by_type;
    update();
  }

</script>

<TabPane tabId={id} active={tab === id}>
  <span slot=tab>
    <Tag tag={$tag_types[id]} />
  </span>

  <div>
    Totaal: {$tag_count_by_type[id] ?? '-'}
  </div>

  <ListGroup>
    {#each tags as t}
      <SelectableListGroupItem
        active={$person && $person._id === t.person_id}
        on:click={() => $person = persons[t.person_id]}
      >
        <Row>
          <Col md=2>
            <Tag tag={$tag_types[id]} />
          </Col>
          <Col md=3>
            <LocaleDateString ts={t.ts_epoch} />
          </Col>
          <Col>
            {#if persons[t.person_id]}
              <PersonTag person={persons[t.person_id]} show_member_year />
            {/if}
          </Col>
        </Row>
      </SelectableListGroupItem>
    {/each}
  </ListGroup>
</TabPane>
