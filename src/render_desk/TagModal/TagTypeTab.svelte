<script>
  import { TabPane, Row, Col } from 'sveltestrap';
  import TagTypeEditButton from './TagTypeEditButton.svelte';
  import SelectableListGroupItem from '../../render/Common/SelectableListGroupItem.svelte';
  import LocaleDateString from '../../render/Common/LocaleDateString.svelte';
  import Tag from '../../render/Tag/Tag.svelte';
  import PersonTag from '../../render/Person/PersonTag.svelte';
  import { selected_person_id } from '../../services/store';
  import { tag_map } from '../../services/store';
  import { tag_type_map } from '../../services/store';
  import Pagination from '../../render/Common/Pagination.svelte';
  import CountBadge from '../../render/Common/CountBadge.svelte';
  import TagTypeDelButton from './TagTypeDelButton.svelte';
  import { person_map } from '../../services/store';
  import ListGroup from '../../render/Common/ListGroup.svelte';

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
  $: tag_type = $tag_type_map.get(type_id) ?? {};

</script>

<TabPane tabId={type_id} active={tab === type_id}>
  <span slot=tab>
    <Tag {type_id} />
  </span>

  <Row>
    <Col md=2>
      <div>
        Totaal: {total_rows ? total_rows : '-'}        
      </div>
      <div>
        <TagTypeDelButton {type_id} on:del />
        <TagTypeEditButton {type_id} on:edit />   
      </div> 
    </Col>
    <Col md=5>
      <div>
        Max/persoon: {tag_type.max_per_person}
      </div>
      <div>
        Omschrijving: {tag_type.description ? tag_type.description : '-'}
      </div>
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
        selectable={$person_map.has(person_id)}
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
