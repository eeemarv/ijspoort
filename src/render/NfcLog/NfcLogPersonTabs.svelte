<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import userIcon from '@iconify/icons-fa/user';
  import { ListGroupItem } from 'sveltestrap';
  import { Row, Col } from 'sveltestrap';
  import { ListGroup } from 'sveltestrap';
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
  export let tab_id_list = [];
  export let tab_person_lists = {};

  const handle_click = (person_id) => {
    dispatch('select_person', person_id);
  };

</script>

{#each tab_id_list as tab_id(tab_id)}
  <TabPane tabId={tab_id}>
    <span slot=tab title="{tab_person_lists[tab_id]?.length ?? '0'} {(tab_person_lists[tab_id]?.length ?? 0) > 1 ? 'personen hebben' : 'persoon heeft'} {tab_id.substring(1)} {parseInt(tab_id.substring(1)) > 1 ? 'tags' : 'tag'}">
      <Icon icon={userIcon} /> {tab_person_lists[tab_id]?.length ?? '0'} > {tab_id.substring(1)}
    </span>
    <ListGroup>
      <ListGroupItem>
        <Row>
          <Col sm=8>
            Persoon
          </Col>
          <Col>
            Laatste NFC tag van {tab_id.substring(1)}
          </Col>
        </Row>
      </ListGroupItem>

      {#if tab === tab_id}
      {#each (tab_person_lists[tab_id] ?? []).slice(start_row, end_row) ?? [] as [nfc_id, person_id], index(nfc_id)}
        <SelectableListGroupItem
          active={$selected_person_id && $selected_person_id === person_id}
          on:click={() => handle_click(person_id)}
        >
        <Row>
          <Col sm=8>
            <CountBadge count={tab_person_lists[tab_id].length - start_row - index} />
            <PersonTag {person_id} show_member_year show_tags />
          </Col>
          <Col>
            <NfcTag
              {nfc_id}
              show_ts_epoch
            />
          </Col>
        </Row>
        </SelectableListGroupItem>
      {/each}
      {/if}
    </ListGroup>
  </TabPane>
{/each}

