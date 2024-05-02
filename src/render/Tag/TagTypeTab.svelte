<script>
  import { TabPane, Row, Col } from 'sveltestrap';
  import { ListGroup } from 'sveltestrap';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import Tag from './Tag.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import { db_tag } from '../services/db';
  import { selected_person_id } from '../services/store';
  import { tag_count_map } from '../services/store';

  export let tab;
  export let type_id;

  let list_length = 30;
  let tag_list = [];

  const update_view = () => {

    db_tag.allDocs({
      startkey: 't' + type_id,
      endkey: 't' + type_id + '\uffff',
      include_docs: false
    }).then((res) => {
      let t_ary = [];

      res.rows.forEach((v) => {
        let a = v.id.substring(3);
        let b = a.split('_');
        t_ary.push({
          ts_epoch: parseInt(b[2]),
          person_id: b[1]
        });
      });

      t_ary.sort((a, b) => b.ts_epoch - a.ts_epoch);
      tag_list = [...t_ary.slice(0, list_length)];

    }).catch((err) => {
      console.log(err);
    });
  };

  $: {
    $tag_count_map.get(type_id);

    if (tab === type_id){
      update_view();
    }
  }

</script>

<TabPane tabId={type_id} active={tab === type_id}>
  <span slot=tab>
    <Tag {type_id} />
  </span>

  <div>
    Totaal: {$tag_count_map.get(type_id) ?? '-'}
  </div>

  <ListGroup>
    {#each tag_list as t, index (index)}
      <SelectableListGroupItem
        active={$selected_person_id && $selected_person_id === t.person_id}
        on:click={() => $selected_person_id = t.person_id}
      >
        <Row>
          <Col md=2>
            <Tag {type_id} />
          </Col>
          <Col md=3>
            <LocaleDateString ts_epoch={t.ts_epoch} />
          </Col>
          <Col>
            <PersonTag person_id={t.person_id} show_member_year />
          </Col>
        </Row>
      </SelectableListGroupItem>
    {/each}
  </ListGroup>
</TabPane>
