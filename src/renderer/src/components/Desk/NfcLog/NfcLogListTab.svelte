<script>
  import { createEventDispatcher } from 'svelte';
  import { Row, Col } from '@sveltestrap/sveltestrap';
  import { Badge } from '@sveltestrap/sveltestrap';
  import { TabPane } from '@sveltestrap/sveltestrap';
  import { desk_selected_person_id } from '../../../services/store';
  import NfcTag from '../../Nfc/NfcTag.svelte';
  import PersonTag from '../../Person/PersonTag.svelte';
  import SelectableListGroupItem from '../../Common/SelectableListGroupItem.svelte';
  import CountBadge from '../../Common/CountBadge.svelte';
  import { person_map } from '../../../services/store';
  import ListGroup from '../../Common/ListGroup.svelte';
  import ListGroupItem from '../../Common/ListGroupItem.svelte';

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
    <ListGroupItem>
      <Row>
        <Col sm=5>
          NFC tag
        </Col>
        <Col>
          Persoon
        </Col>
      </Row>
    </ListGroupItem>
    {#if tab === 't0'}
    {#each nfc_list.slice(start_row, end_row) as [nfc_id, person_id], index(nfc_id)}
      <SelectableListGroupItem
        active={$desk_selected_person_id && $desk_selected_person_id === person_id}
        on:click={() => handle_click(person_id)}
        selectable={$person_map.has(person_id)}
      >
        <Row>
          <Col sm=5>
            <CountBadge count={(nfc_list?.length ?? 0) - start_row - index} />
            <NfcTag {nfc_id}
              show_uid_type
              show_ts_epoch
              fetch_abc_index
            />
          </Col>
          <Col>
            <PersonTag {person_id} show_member_period show_tags />
          </Col>
        </Row>
      </SelectableListGroupItem>
    {/each}
    {/if}
  </ListGroup>
</TabPane>
