<script>
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { Row, Col } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import { desk_selected_person_id } from '../../../services/store';
  import { person_map } from '../../../services/store';
  import { nfc_map } from '../../../services/store';
  import { person_nfc_map } from '../../../services/store';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import Pagination from '../../Common/Pagination.svelte';
  import Checkbox from '../../Common/Checkbox.svelte';
  import NfcLogListTab from './NfcLogListTab.svelte';
  import NfcLogPersonTabs from './NfcLogPersonTabs.svelte';
  import PersonMemberPeriodFilterTag from '../../Person/PersonMemberPeriodFilterTag.svelte';
  import { desk_member_period_filter } from '../../../services/store';
  import { member_person_map } from '../../../services/store';

  let nfc_week_count = 0;
  let nfc_month_count = 0;
  let nfc_4b_count = 0;
  let nfc_7b_count = 0;

  let nfc_list = [];
  let tab_id_list = [];
  let tab_person_lists = {};

  let start_row = 0;
  let end_row = 0;
  let set_total_rows = () => {};
  let total_rows = 0;

  let tab = 't0';
  let open = false;

  let checked_4b = true;
  let checked_7b = true;
  let checked_desk_member_period_filter = false;
  let checked_has_person = true;
  let checked_has_no_person = true;
  let checked_is_blocked = true;
  let checked_is_not_blocked = true;

  export const toggle = () => {
    open = !open
  };

  const handle_select_person = (e) => {
    $desk_selected_person_id = e.detail;
    open = false;
  };

  const update_filtered_nfc_map = () => {
    const ts_epoch = new Date();
    const ts_one_week_ago = ts_epoch.getTime() - (86400000 * 7);
    const ts_one_month_ago = ts_epoch.getTime() - (86400000 * 30);

    const f_nfc_list = [];

    const person_tab_map = new Map();
    const person_handled_set = new Set();

    let l_nfc_4b_count = 0;
    let l_nfc_7b_count = 0;
    let l_nfc_month_count = 0;
    let l_nfc_week_count = 0;

    for (const [nfc_id, nfc] of $nfc_map){

      if (!typeof nfc.person_id === 'string'){
        console.warn('-- nfc without person id ', nfc);
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
        if (checked_desk_member_period_filter){

          if (typeof $desk_member_period_filter !== 'string'){
            continue;
          }
          if (!$member_person_map.has($desk_member_period_filter)){
            continue;
          }
          if (!$member_person_map.get($desk_member_period_filter).has(nfc.person_id)){
            continue;
          }
        }
      }

      const is_blocked = typeof nfc.blocked !== 'undefined';

      if (is_blocked && !checked_is_blocked){
        continue;
      }

      if (!is_blocked && !checked_is_not_blocked){
        continue;
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

      f_nfc_list.push([nfc_id, nfc.person_id]);

      const p_nfc_set = $person_nfc_map.get(nfc.person_id);

      if (!p_nfc_set.size){
        console.warn('empty person_nfc for nfc', nfc);
        continue;
      }

      if (!p_nfc_set.has(nfc_id)){
        console.warn('person_nfc_map mismatch person id ' + nfc.person_id
          + ' nfc_id ' + nfc_id + ' nfc: ', nfc);
        continue;
      }

      if (p_nfc_set.size === 1){
        if (!person_tab_map.has('t1')){
          person_tab_map.set('t1', []);
        }
        person_tab_map.get('t1').push([nfc_id, nfc.person_id]);
        continue;
      }

      if (person_handled_set.has(nfc.person_id)){
        continue;
      }

      if ([...p_nfc_set][p_nfc_set.size - 1] !== nfc_id){
        continue;
      }

      const p_tab_id = 't' + p_nfc_set.size;

      if (!person_tab_map.has(p_tab_id)){
        person_tab_map.set(p_tab_id, []);
      }

      person_tab_map.get(p_tab_id).push([nfc_id, nfc.person_id]);
      person_handled_set.add(nfc.person_id);
    }

    nfc_week_count = l_nfc_week_count;
    nfc_month_count = l_nfc_month_count;
    nfc_4b_count = l_nfc_4b_count;
    nfc_7b_count = l_nfc_7b_count;

    nfc_list = [...f_nfc_list.reverse()];
    tab_id_list = [...person_tab_map.keys()].sort();

    const f_tab_person_lists = {};

    for (const [tab_id, nfc_id_list] of person_tab_map){
      f_tab_person_lists[tab_id] = [...nfc_id_list.reverse()];
    }

    tab_person_lists = {...f_tab_person_lists};

    console.log('=tab_id_list=', tab_id_list);
    console.log(tab_id_list);

    tab_select_total_rows();
    set_total_rows(total_rows);
  }

  const tab_select_total_rows = () => {
    if (tab === 't0'){
      total_rows = nfc_list.length;
    } else if (tab.startsWith('t')){
      total_rows = tab_person_lists[tab]?.length ?? 0;
    } else {
      total_rows = 0;
    }
  };

  const handle_paginate_results = (e) => {
    start_row = e.detail.start_row;
    end_row = e.detail.end_row;
  };

  $: {
    checked_4b;
    checked_7b;
    checked_desk_member_period_filter;
    checked_has_person;
    checked_has_no_person;
    checked_is_blocked;
    checked_is_not_blocked;
    $nfc_map;
    $person_map;
    if (open){
      update_filtered_nfc_map();
    }
  }

  $: {
    tab;
    tab_select_total_rows();
    set_total_rows(total_rows);
  }

  $: if ($desk_selected_person_id){
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
          7b uid: {nfc_7b_count}
        </Checkbox>
        <Checkbox
          title="Filter op lidmaatschap"
          name=checked_desk_member_period_filter
          bind:checked={checked_desk_member_period_filter}
        >
          Enkel leden <PersonMemberPeriodFilterTag />
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
        <Checkbox
          title="Toon geblokkeerde nfc tags"
          bind:checked={checked_is_blocked}
          name=checked_is_blocked
        >
          Geblokkeerd
        </Checkbox>
        <Checkbox
          title="Toon niet geblokkeerde nfc tags"
          bind:checked={checked_is_not_blocked}
          name=checked_is_not_blocked
        >
          Niet geblokkeerd
        </Checkbox>
      </Col>
      <Col sm=5>
        <Pagination
          bind:set_total_rows
          on:change={handle_paginate_results}
        />
      </Col>
    </Row>
    <TabContent on:tab={(e) => tab = e.detail} pills>

      <NfcLogListTab
        {tab}
        {nfc_list}
        {start_row}
        {end_row}
        {nfc_week_count}
        {nfc_month_count}
        on:select_person={handle_select_person}
      />

      <NfcLogPersonTabs
        {tab}
        {tab_id_list}
        {tab_person_lists}
        {start_row}
        {end_row}
        on:select_person={handle_select_person}
      />

    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
