<script>
  import Icon from '@iconify/svelte';
  import userIcon from '@iconify/icons-fa/user';
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { Row, Col } from 'sveltestrap';
  import { ListGroup } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { TabContent, TabPane } from 'sveltestrap';
  import { FormGroup, Label } from 'sveltestrap';
  import { focus_year, nfc_uid, selected_person_id } from '../services/store';
  import { person } from '../services/store';
  import { nfc_table } from '../services/store';
  import { nfc_sorted_ary } from '../services/store';
  import { person_table } from '../services/store';
  import { person_nfc_table } from '../services/store';
  import NfcTag from './NfcTag.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import PersonFocusYearTag from '../Person/PersonFocusYearTag.svelte';
  import SelectListLength from '../Common/SelectListLength.svelte';

  let nfc_count = 0;
  let nfc_week_count = 0;
  let nfc_month_count = 0;
  let nfc_4b_count = 0;
  let nfc_7b_count = 0;

  let t0_nfc_list = [];
  let tx_tab_list = [];
  let tx_tab_table = {};
  let tx_tab_count_table = {};

  let tab = 't0';
  let open = false;
  let checked_4b = true;
  let checked_7b = true;
  let checked_focus_year = false;
  let list_length = 10;

  export const toggle = () => (open = !open);

  const update_view_data = () => {
    const ts_epoch = new Date();
    let ts_one_week_ago = ts_epoch.getTime() - (86400000 * 7);
    let ts_one_month_ago = ts_epoch.getTime() - (86400000 * 30);
    let focus_year_key = 'y' + $focus_year;

    let l_nfc_count = 0;
    let l_nfc_week_count = 0;
    let l_nfc_month_count = 0;
    let l_nfc_4b_count = 0;
    let l_nfc_7b_count = 0;
    let l_t0_nfc_list = [];
    let l_tx_tab_table = {};
    let l_tx_tab_count_table = {};
    let l_tx_person_table = {};

    $nfc_sorted_ary.forEach((a) => {

      let person_id = $nfc_table[a.id].person_id;

      if (person_id === undefined){
        return;
      }

      let person = $person_table[person_id];

      if (person === undefined){
        return;
      }

      if (checked_focus_year){

        if (person.member_year === undefined){
          return;
        }

        if (person.member_year[focus_year_key] === undefined){
          return;
        }
      }

      let uid = $nfc_table[a.id].uid;

      if (uid === undefined){
        return;
      }

      if (uid.length === 8){
        l_nfc_4b_count++;
      }

      if (uid.length === 14){
        l_nfc_7b_count++;
      }

      if (!checked_4b && uid.length === 8){
        return;
      }

      if (!checked_7b && uid.length === 14){
        return;
      }

      if (a.ts_epoch > ts_one_week_ago){
        l_nfc_week_count++;
      }

      if (a.ts_epoch > ts_one_month_ago){
        l_nfc_month_count++;
      }

      l_nfc_count++;

      if (l_t0_nfc_list.length < list_length){
        l_t0_nfc_list.push(a.id);
      }

      if (l_tx_person_table[person_id] !== undefined){
        return;
      }

      l_tx_person_table[person_id] = true;

      let nfc_count_for_person = Object.keys($person_nfc_table[person_id]).length;

      if (!nfc_count_for_person){
        return;
      }

      let tab_key = 't' + nfc_count_for_person;

      if (l_tx_tab_table[tab_key] === undefined){
        l_tx_tab_table[tab_key] = [];
      }

      if (l_tx_tab_table[tab_key].length < list_length){
        l_tx_tab_table[tab_key].push(person_id);
      }

      if (l_tx_tab_count_table[tab_key] === undefined){
        l_tx_tab_count_table[tab_key] = 0;
      }

      l_tx_tab_count_table[tab_key]++;
    });

    nfc_count = l_nfc_count;
    nfc_week_count = l_nfc_week_count;
    nfc_month_count = l_nfc_month_count;
    nfc_4b_count = l_nfc_4b_count;
    nfc_7b_count = l_nfc_7b_count;
    t0_nfc_list = l_t0_nfc_list;

    console.log('=l_tx_tab_table==');
    console.log(l_tx_tab_table);

    tx_tab_table = l_tx_tab_table;
    tx_tab_count_table = l_tx_tab_count_table;

    tx_tab_list = Object.keys(l_tx_tab_table).sort((a, b) => {
      return parseInt(a.substring(1)) - parseInt(b.substring(1));
    });

    console.log('=tx_tab_list=====');
    console.log(tx_tab_list);
  }

  $: {
    checked_4b;
    checked_7b;
    checked_focus_year;
    open;
    $nfc_table;
    $person_table;
    list_length;
    if (open){
      update_view_data();
    }
  }

  $: if ($nfc_uid || $person){
    open = false;
  }
</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Geactiveerde NFC tags
  </ModalHeader>
  <ModalBody>
    <Row>
      <Col>
        <SelectListLength {list_length} on:change={() => update_view_data()} />
      </Col>
      <Col>
        <div class=form-check title="Filter op tags met 4 byte UID">
          <input class=form-check-input type=checkbox id=checked_4b bind:checked={checked_4b}>
          <label class=form-check-label for=checked_4b>
            4b uid: {nfc_4b_count}
          </label>
        </div>
        <div class=form-check title="Filter op tags met 7 byte UID">
          <input class=form-check-input type=checkbox id=checked_7b bind:checked={checked_7b}>
          <label class=form-check-label for=checked_7b>
            7b uid: {nfc_7b_count}
          </label>
        </div>
        <div class=form-check title="Filter op leden in lidjaar">
          <input class=form-check-input type=checkbox id=checked_focus_year bind:checked={checked_focus_year}>
          <label class=form-check-label for=checked_focus_year>
            Enkel leden <PersonFocusYearTag />
          </label>
        </div>
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
          {#each t0_nfc_list as nfc_id(nfc_id)}
            <SelectableListGroupItem
              active={$person && $person._id === $nfc_table[nfc_id].person_id}
              on:click={() => $person = $person_table[$nfc_table[nfc_id].person_id]}
            >
              <Row>
                <Col md=6>
                  <NfcTag {nfc_id} />
                </Col>
                <Col>
                  <PersonTag person_id={$nfc_table[nfc_id].person_id} show_member_year show_tags />
                </Col>
              </Row>
            </SelectableListGroupItem>
          {/each}
        </ListGroup>
      </TabPane>
      {#each tx_tab_list as tx(tx)}
      <TabPane tabId={tx} active={tab === (tx)}>
        <span slot=tab title="{tx_tab_count_table[tx]} {tx_tab_count_table[tx] > 1 ? 'personen hebben' : 'persoon heeft'} {tx.substring(1)} {parseInt(tx.substring(1)) > 1 ? 'tags' : 'tag'}">
          <Icon icon={userIcon} /> {tx_tab_count_table[tx]} > {tx.substring(1)}
        </span>
        <ListGroup>
          {#each tx_tab_table[tx] as person_id(person_id)}
            <SelectableListGroupItem
              active={$selected_person_id && $selected_person_id === person_id}
              on:click={() => $selected_person_id = person_id}
            >
              <PersonTag {person_id} show_member_year show_tags />
            </SelectableListGroupItem>
          {/each}
        </ListGroup>
      </TabPane>
      {/each}
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
