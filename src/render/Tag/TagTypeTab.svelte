<script>
  import { TabPane, Row, Col } from 'sveltestrap';
  import { ListGroup } from 'sveltestrap';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import Tag from './Tag.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import { selected_person_id } from '../services/store';
  import { tag_map } from '../services/store';
  import Pagination from '../Common/Pagination.svelte';
  import CountBadge from '../Common/CountBadge.svelte';

  export let tab;
  export let type_id;

  let start_row = 0;
  let end_row = 0;
  let set_total_rows = () => {};

  const handle_person_select = (person_id) => {
    $selected_person_id = person_id;
  };

  const handle_paginate_results = (e) => {
    start_row = e.detail.start_row;
    end_row = e.detail.end_row;
  };

  $: total_rows = $tag_map.has(type_id) ? $tag_map.get(type_id).size : 0;
  $: set_total_rows(total_rows);

</script>

<TabPane tabId={type_id} active={tab === type_id}>
  <span slot=tab>
    <Tag {type_id} />
  </span>

  <Row>
    <Col>
      Totaal: {total_rows ? total_rows : '-'}
    </Col>
    <Col>
      <Pagination
        bind:set_total_rows
        on:change={handle_paginate_results}
      />
    </Col>
  </Row>

  {#if $tag_map.has(type_id)}
  <ListGroup>
    {#each [...$tag_map.get(type_id)].reverse().slice(start_row, end_row) as [ts_epoch, person_id], index (ts_epoch)}
      <SelectableListGroupItem
        active={$selected_person_id === person_id}
        on:click={() => handle_person_select(person_id)}
      >
        <Row>
          <Col md=5>
            <CountBadge count={total_rows - start_row - index} />
            <Tag {type_id} />
            <LocaleDateString ts_epoch={ts_epoch} />
          </Col>
          <Col>
            <PersonTag person_id={person_id} show_member_year />
          </Col>
        </Row>
      </SelectableListGroupItem>
    {/each}
  </ListGroup>
  {/if}
</TabPane>
