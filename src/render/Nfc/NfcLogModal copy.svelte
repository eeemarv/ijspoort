<script>
  import Icon from '@iconify/svelte';
  import userIcon from '@iconify/icons-fa/user';
  import { ListGroupItem, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { Row, Col } from 'sveltestrap';
  import { ListGroup } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { TabContent, TabPane } from 'sveltestrap';
  import { focus_year, selected_person_id } from '../services/store';
  import { person_map } from '../services/store';
  import { nfc_map } from '../services/store';
  import NfcTag from './NfcTag.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import PersonFocusYearTag from '../Person/PersonFocusYearTag.svelte';
  import Pagination from '../Common/Pagination.svelte';
  import CountBadge from '../Common/CountBadge.svelte';
  import Checkbox from '../Common/Checkbox.svelte';

  let nfc_count = 0;
  let nfc_week_count = 0;
  let nfc_month_count = 0;
  let nfc_4b_count = 0;
  let nfc_7b_count = 0;

  let start_row = 0;
  let end_row = 0;
  let set_total_rows = () => {};
  let total_rows = 0;

  const nfc_list = [];
  const tab_list_table = {};

  let t0_nfc_list = [];
  let tx_tab_id_list = [];
  let tx_tab_list_table = {};

  let tab = 't0';
  let open = false;
  let checked_4b = true;
  let checked_7b = true;
  let checked_focus_year = false;
  let checked_has_person = true;
  let checked_has_no_person = true;
  let person_last_nfc_map = new Map();

  export const toggle = () => (open = !open);

  const handle_click_list_item = (person_id) => {
    $selected_person_id = person_id;
    open = false;
  };

  const update_view_data = () => {
    const ts_epoch = new Date();
    const ts_one_week_ago = ts_epoch.getTime() - (86400000 * 7);
    const ts_one_month_ago = ts_epoch.getTime() - (86400000 * 30);
    const focus_year_key = 'y' + $focus_year;

    let l_nfc_week_count = 0;
    let l_nfc_month_count = 0;
    let l_nfc_4b_count = 0;
    let l_nfc_7b_count = 0;

    const person_nfc_count_map = new Map();

    person_last_nfc_map.clear();
    nfc_list.length = 0;
    tx_tab_id_list.length = 0;

    for (const prop in tx_tab_list_table){
      delete tab_list_table[prop];
    }

    for (const prop in tab_list_table){
      delete tab_list_table[prop];
    }

    for (const [nfc_id, nfc] of $nfc_map){

      if (nfc.uid === undefined){
        console.log('error stored nfc without uid prop: ', nfc);
        continue;
      }

      const has_person = $person_map.has(nfc.person_id);

      if (has_person && !checked_has_person){
        continue;
      }

      if (!has_person && !checked_has_no_person){
        continue;
      }

      if (has_person){
        const person = $person_map.get(nfc.person_id);

        if (checked_focus_year){

          if (person.member_year === undefined){
            continue;
          }

          if (person.member_year[focus_year_key] === undefined){
            continue;
          }
        }
      }

      if (nfc.uid.length === 8){
        l_nfc_4b_count++;
      }

      if (nfc.uid.length === 14){
        l_nfc_7b_count++;
      }

      if (!checked_4b && nfc.uid.length === 8){
        continue;
      }

      if (!checked_7b && nfc.uid.length === 14){
        continue;
      }

      if (nfc.ts_epoch > ts_one_week_ago){
        l_nfc_week_count++;
      }

      if (nfc.ts_epoch > ts_one_month_ago){
        l_nfc_month_count++;
      }

      nfc_list.push(nfc_id);

      if (!has_person){
        continue;
      }

      if (person_nfc_count_map.has(nfc.person_id)){
        let c = person_nfc_count_map.get(nfc.person_id);
        person_nfc_count_map.set(nfc.person_id, c + 1);
      }
      else
      {
        person_nfc_count_map.set(nfc.person_id, 1);
      }

      person_last_nfc_map.set(nfc.person_id, nfc_id);
    }

    nfc_count = nfc_list.length;
    nfc_week_count = l_nfc_week_count;
    nfc_month_count = l_nfc_month_count;
    nfc_4b_count = l_nfc_4b_count;
    nfc_7b_count = l_nfc_7b_count;

    for (const [person_id, nfc_count] of person_nfc_count_map){
      const tab = 't' + nfc_count;

      if (tab_list_table[tab] === undefined){
        tab_list_table[tab] = [];
      }

      tab_list_table[tab].push(person_id);
    }

    /** reverse order by nfc ts_epoch */

    nfc_list.reverse();

    Object.values(tab_list_table).forEach((person_id_ary) => {
      person_id_ary.sort((a, b) => {
        const ts_epoch_a = $nfc_map.get(person_last_nfc_map.get(a)).ts_epoch;
        const ts_epoch_b = $nfc_map.get(person_last_nfc_map.get(b)).ts_epoch;
        return ts_epoch_b - ts_epoch_a;
      });
    });

    tx_tab_id_list = Object.keys(tab_list_table).sort((a, b) => {
      return parseInt(a.substring(1)) - parseInt(b.substring(1));
    });

    console.log('=tx_tab_id_list=====');
    console.log(tx_tab_id_list);

    tab_select_total_rows();
    set_total_rows(total_rows);
  }

  const tab_select_total_rows = () => {
    if (tab === 't0'){
      total_rows = nfc_list.length;
    } else if (tab.startsWith('t')){
      total_rows = tab_list_table[tab].length;
    } else {
      total_rows = 0;
    }
  };

  const handle_paginate_results = (e) => {
    start_row = e.detail.start_row;
    end_row = e.detail.end_row;

    if (tab === 't0'){
      t0_nfc_list = nfc_list.slice(start_row, end_row);

    } else if (tab.startsWith('t')){

      Object.entries(tab_list_table).forEach(([tab, person_id_ary]) => {
        tx_tab_list_table[tab] = person_id_ary.slice(start_row, end_row);
      });

      tx_tab_list_table = tx_tab_list_table;

      console.log('tx_tab_list_table =====', tx_tab_list_table);
    }
  };

  $: {
    checked_4b;
    checked_7b;
    checked_focus_year;
    checked_has_person;
    checked_has_no_person;
    open;
    $nfc_map;
    $person_map;
    if (open){
      update_view_data();
    }
  }

  $: {
    tab;
    tab_select_total_rows();
    set_total_rows(total_rows);
  }

  $: if ($selected_person_id){
    open = false;
  }

</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Geactiveerde NFC tags
  </ModalHeader>
  <ModalBody>
    <Row class=mb-2>
      <Col>
        <Checkbox name=checked_4b
          title="Filter op tags met 4 byte UID"
          bind:checked={checked_4b}
        >
          4b uid: {nfc_4b_count}
        </Checkbox>
        <Checkbox name=checked_7b
          title="Filter op tags met 7 byte UID"
          bind:checked={checked_7b}
        >
          4b uid: {nfc_7b_count}
        </Checkbox>
        <Checkbox
          title="Filter op leden in lidjaar"
          name=checked_focus_year
          bind:checked={checked_focus_year}
        >
          Enkel leden <PersonFocusYearTag />          
        </Checkbox>
      </Col>
      <Col>
        <Checkbox
          title="Toon nfc tags die gelinkt zijn aan een persoon"
          bind:checked={checked_has_person}
          name=checked_has_person
        >
          Persoon gelinkt
        </Checkbox>
        <Checkbox
          title="Toon nfc tags niet niet meer gelinkt zijn aan een persoon (oud-leden verwijderd uit database)"
          bind:checked={checked_has_no_person}
          name=checked_has_no_person
        >
          Persoon niet gelinkt
        </Checkbox>
      </Col>
      <Col sm=5>
        <Pagination
          bind:set_total_rows
          on:change={handle_paginate_results}
        />
      </Col>
    </Row>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      <TabPane tabId=t0 active={tab === 't0'}>
        <span slot=tab>
          Totaal: {nfc_count}
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
          {#each t0_nfc_list as nfc_id, index(nfc_id)}
            <SelectableListGroupItem
              active={$selected_person_id && $selected_person_id === $nfc_map.get(nfc_id).person_id}
              on:click={() => handle_click_list_item($nfc_map.get(nfc_id).person_id)}
            >
              <Row>
                <Col sm=4>
                  <CountBadge count={total_rows - start_row - index} />
                  <NfcTag {nfc_id}
                    show_ts_epoch
                  />
                </Col>
                <Col>
                  <PersonTag person_id={$nfc_map.get(nfc_id).person_id} show_member_year show_tags />
                </Col>
              </Row>
            </SelectableListGroupItem>
          {/each}
        </ListGroup>
      </TabPane>
      {#each tx_tab_id_list as tx(tx)}
      <TabPane tabId={tx} active={tab === (tx)}>
        <span slot=tab title="{tab_list_table[tx].length} {tab_list_table[tx].length > 1 ? 'personen hebben' : 'persoon heeft'} {tx.substring(1)} {parseInt(tx.substring(1)) > 1 ? 'tags' : 'tag'}">
          <Icon icon={userIcon} /> {tab_list_table[tx].length} > {tx.substring(1)}
        </span>
        <ListGroup>
          {#if tx !== 't1'}
          <ListGroupItem>
            <Row>
              <Col sm=8>
                Persoon
              </Col>
              <Col>
                Laatste NFC tag (van {tx.substring(1)})
              </Col>
            </Row>
          </ListGroupItem>
          {/if}
          {#each tx_tab_list_table[tab] ?? [] as person_id, index(person_id)}
            <SelectableListGroupItem
              active={$selected_person_id && $selected_person_id === person_id}
              on:click={() => handle_click_list_item(person_id)}
            >
            <Row>
              <Col sm=8>
                <CountBadge count={total_rows - start_row - index} />
                <PersonTag {person_id} show_member_year show_tags />
              </Col>
              <Col>
                <NfcTag
                  nfc_id={person_last_nfc_map.get(person_id)}
                  show_ts_epoch
                />
              </Col>
            </Row>
            </SelectableListGroupItem>
          {/each}
        </ListGroup>
      </TabPane>
      {/each}
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
