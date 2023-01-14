<script>
  import Icon from '@iconify/svelte';
  import userIcon from '@iconify/icons-fa/user';
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { Row, Col } from 'sveltestrap';
  import { ListGroup } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { TabContent, TabPane } from 'sveltestrap';
  import { FormGroup, Label } from 'sveltestrap';
  import { db_nfc, db_person } from '../services/db';
  import { nfc_uid } from '../services/store';
  import { person } from '../services/store';
  import { nfc_count } from '../services/store';
  import { nfc_4b_count } from '../services/store';
  import { nfc_7b_count } from '../services/store';
  import NfcTag from './NfcTag.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';

  let nfc_list_count = 0;
  let nfcs = [];
  let persons = {};
  let nfc_count_week = 0;
  let nfc_count_month = 0;
  let nfc_person_count = {};
  let nfc_person_count_ary = [];
  let tab = 'nfc_count';

  let open = false;
  let c_4b = true;
  let c_7b = true;
  let list_length = 10;
  const list_length_options = [5, 10, 25, 50, 100, 250, 500, 1000, 2500];

  export const toggle = () => (open = !open);

  const update_nfcs = () => {
    const ts_epoch = new Date();
    let tab_nfc_count = undefined;
    let search_prefix = 'search/count_';

    person_ary = [];

    if (!c_4b && !c_7b){
      nfc_list_count = 0;
      nfc_count_week = 0;
      nfc_count_month = 0;
      nfcs = [];
      nfc_person_count_ary = [];
      return;
    }

    if (!(c_4b && c_7b)){
      if (c_4b){
        search_prefix += '4b_';
      } else {
        search_prefix += '7b_';
      }
    }

    if (tab.startsWith('nfc_count_')){
      tab_nfc_count = parseInt(tab.substring(10));
    }

    if (tab === 'nfc_count'){
      db_nfc.query(search_prefix + 'by_ts_epoch', {
        startkey: ts_epoch.getTime() + 86400000,
        descending: true,
        include_docs: true,
        limit: list_length,
        reduce: false
      }).then((res) => {
        console.log('nfc limit ' + list_length);
        console.log(res);
        nfc_list_count = res.total_rows;
        nfcs = res.rows;
        console.log('nfcs', nfcs);
        let person_keys = [];
        nfcs.forEach((v) => {
          person_keys.push(v.doc.person_id);
        });
        console.log('person_keys', person_keys);
        return db_person.allDocs({
          keys: person_keys,
          include_docs: true
        });
      }).then((res) => {
        console.log('persons (nfcs)');
        console.log(res);
        res.rows.forEach((p) => {
          persons[p.id] = {...p.doc};
        });
      }).catch((err) => {
        console.log(err);
      });
    } else {
      nfcs = [];
    }

    if (tab === 'nfc_count'){
      db_nfc.query(search_prefix + 'by_ts_epoch', {
        endkey: ts_epoch.getTime() + 86400000,
        startkey: ts_epoch.getTime() - (86400000 * 7),
      }).then((res) => {
        console.log(' ---- nfc count week ----');
        console.log(res);
        if (res.rows.length){
          nfc_count_week = res.rows[0].value;
        } else {
          nfc_count_week = 0;
        }
      }).catch((err) => {
        console.log(err);
      });
    }

    if (tab === 'nfc_count'){
      db_nfc.query(search_prefix + 'by_ts_epoch', {
        endkey: ts_epoch.getTime() + 86400000,
        startkey: ts_epoch.getTime() - (86400000 * 30),
      }).then((res) => {
        console.log(' ---- nfc count month ----');
        console.log(res);
        if (res.rows.length){
          nfc_count_month = res.rows[0].value;
        } else {
          nfc_count_month = 0;
        }
      }).catch((err) => {
        console.log(err);
      });
    }

    db_nfc.query(search_prefix + 'by_person_id', {
      group: true
    }).then((res) => {
      console.log('COUNT_BY_PERSON_ID');
      console.log(res);
      let person_keys = [];
      nfc_person_count = {};
      nfc_person_count_ary = [];
      res.rows.forEach((v) => {
        if (!nfc_person_count[v.value]){
          nfc_person_count[v.value] = 0;
        }
        nfc_person_count[v.value]++;
        if (v.value === tab_nfc_count){
          if (person_keys.length < list_length){
            person_keys.push(v.key);
          }
        }
      });
      console.log('-- %% nfc_person_count %% --');
      console.log(nfc_person_count);
      Object.keys(nfc_person_count).forEach((k) => {
        nfc_person_count_ary.push({
          count_nfcs: parseInt(k),
          count_persons: nfc_person_count[k],
          person_ary: []
        });
      });
      console.log('nfc_person_count_ary');
      console.log(nfc_person_count_ary);
      if (tab === 'nfc_count'){
        return;
      }
      console.log('person_keys n-count', person_keys);
      return db_person.allDocs({
        keys: person_keys,
        include_docs: true
      });
    }).then((res) => {
      console.log('persons (n-count)');
      console.log(res);
      let person_ary = [];
      if (typeof res === 'object'
        && typeof res.rows === 'object'
      ){
        res.rows.forEach((p) => {
          person_ary.push({...p.doc});
        });
      }
      console.log('-- PERSON_ARY -- n-count');
      console.log(person_ary);
      let index = nfc_person_count_ary.findIndex((el) => el.count_nfcs === tab_nfc_count);
      console.log('index', index);
      if (typeof nfc_person_count_ary[index] === 'object'){
        nfc_person_count_ary[index].person_ary = person_ary;
      }
    }).catch((err) => {
        console.log(err);
    });
  };

  $: {
    c_4b;
    c_7b;
    tab;
    open;
    $nfc_count;
    update_nfcs();
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
        <FormGroup>
          <Label for=list_length>Toon aantal in lijst (maximum)</Label>
          <select id=list_length bind:value={list_length} class=form-control name=list_length on:change={() => update_nfcs()}>
            {#each list_length_options as l (l)}
              <option>{l}</option>
            {/each}
          </select>
        </FormGroup>
      </Col>
      <Col>
        <div class=form-check title="Filter op tags met 4 byte UID">
          <input class=form-check-input type=checkbox id=c_4b bind:checked={c_4b}>
          <label class=form-check-label for=c_4b>
            4b uid: {$nfc_4b_count}
          </label>
        </div>
        <div class=form-check title="Filter op tags met 7 byte UID">
          <input class=form-check-input type=checkbox id=c_7b bind:checked={c_7b}>
          <label class=form-check-label for=c_7b>
            7b uid: {$nfc_7b_count}
          </label>
        </div>
      </Col>
    </Row>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      <TabPane tabId=nfc_count active={tab === 'nfc_count'}>
        <span slot=tab>
          Totaal: {nfc_list_count}
        </span>
        <div>
          Laatste week
            <Badge color=accent>
              {nfc_count_week}
            </Badge>
          Laatste maand
            <Badge color=accent>
              {nfc_count_month}
            </Badge>
        </div>
        <ListGroup>
          {#each nfcs as n(n.key)}
            <SelectableListGroupItem
              active={$person && $person._id === n.doc.person_id}
              on:click={() => $person = persons[n.doc.person_id]}
            >
              <Row>
                <Col md=6>
                  <NfcTag nfc={n.doc} />
                </Col>
                <Col>
                  {#if persons[n.doc.person_id]}
                    <PersonTag person={persons[n.doc.person_id]} show_member_year />
                  {/if}
                </Col>
              </Row>
            </SelectableListGroupItem>
          {/each}
        </ListGroup>
      </TabPane>
      {#each nfc_person_count_ary as np(np.count_nfcs)}
      <TabPane tabId={'nfc_count_' + np.count_nfcs} active={tab === ('nfc_count_' + np.count_nfcs)}>
        <span slot=tab title="{np.count_persons} {np.count_persons > 1 ? 'personen hebben' : 'persoon heeft'} {np.count_nfcs} {np.count_nfcs > 1 ? 'tags' : 'tag'}">
          <Icon icon={userIcon} /> {np.count_persons} > {np.count_nfcs}
        </span>
        <ListGroup>
          {#each np.person_ary as p(p._id)}
            <SelectableListGroupItem
              active={$person && $person._id === p._id}
              on:click={() => $person = p}
            >
              <PersonTag person={p} show_member_year />
            </SelectableListGroupItem>
          {/each}
        </ListGroup>
      </TabPane>
      {/each}
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
