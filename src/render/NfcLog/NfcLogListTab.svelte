<script>
  import { createEventDispatcher } from 'svelte';
  import { Row, Col } from 'sveltestrap';
  import { ListGroup } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { TabPane } from 'sveltestrap';
  import { selected_person_id } from '../services/store';
  import NfcTag from '../Nfc/NfcTag.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import CountBadge from '../Common/CountBadge.svelte';

  const dispatch = createEventDispatcher();

  export let tab = 't0';
  export let start_row = 0;
  export let end_row = 0;

  export let nfc_week_count = 0;
  export let nfc_month_count = 0;
  export let nfc_list = [];

  const handle_click = (person_id) => {
    dispatch('select_person', person_id);
  };
</script>

<TabPane tabId=t0 active>
  <span slot=tab>
    Totaal: {nfc_list.length}
  </span>
  <div>
    Laatste week
      <Badge color=accent>
        {nfc_week_count}
      </Badge>
    Laatste maand
      <Badge color=accent>
        {nfc_month_count}
      </Badge>
  </div>
  <ListGroup>
    {#if tab === 't0'}
    {#each nfc_list.slice(start_row, end_row) as [nfc_id, person_id], index(nfc_id)}
      <SelectableListGroupItem
        active={$selected_person_id && $selected_person_id === person_id}
        on:click={() => handle_click(person_id)}
      >
        <Row>
          <Col sm=5>
            <CountBadge count={(nfc_list?.length ?? 0) - start_row - index} />
            <NfcTag {nfc_id}
              show_ts_epoch
            />
          </Col>
          <Col>
            <PersonTag {person_id} show_member_year show_tags />
          </Col>
        </Row>
      </SelectableListGroupItem>
    {/each}
    {/if}
  </ListGroup>
</TabPane>
