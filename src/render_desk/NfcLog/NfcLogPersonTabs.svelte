<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import userIcon from '@iconify/icons-fa/user';
  import { Row, Col } from 'sveltestrap';
  import { TabPane } from 'sveltestrap';
  import { selected_person_id } from '../../services/store';
  import NfcTag from '../../render/Nfc/NfcTag.svelte';
  import PersonTag from '../../render/Person/PersonTag.svelte';
  import SelectableListGroupItem from '../../render/Common/SelectableListGroupItem.svelte';
  import CountBadge from '../../render/Common/CountBadge.svelte';
  import { person_map } from '../../services/store';
  import ListGroup from '../../render/Common/ListGroup.svelte';
  import ListGroupItem from '../../render/Common/ListGroupItem.svelte';

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
            {#if tab_id === 't1'}
              NFC tag
            {:else}
              Laatste NFC tag van {tab_id.substring(1)}
            {/if}
          </Col>
        </Row>
      </ListGroupItem>

      {#if tab === tab_id}
      {#each (tab_person_lists[tab_id] ?? []).slice(start_row, end_row) ?? [] as [nfc_id, person_id], index(nfc_id)}
        <SelectableListGroupItem
          active={$selected_person_id && $selected_person_id === person_id}
          on:click={() => handle_click(person_id)}
          selectable={$person_map.has(person_id)}
        >
        <Row>
          <Col sm=8>
            <CountBadge count={tab_person_lists[tab_id].length - start_row - index} />
            <PersonTag {person_id} show_member_period show_tags />
          </Col>
          <Col>
            <NfcTag
              {nfc_id}
              show_uid_type
              show_ts_epoch
              fetch_abc_index
            />
          </Col>
        </Row>
        </SelectableListGroupItem>
      {/each}
      {/if}
      </ListGroup>
  </TabPane>
{/each}
