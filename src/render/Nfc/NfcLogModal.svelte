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
  import { focus_year, nfc_uid } from '../services/store';
  import { person } from '../services/store';
  import { nfc_count } from '../services/store';
  import { nfc_4b_count } from '../services/store';
  import { nfc_7b_count } from '../services/store';
  import NfcTag from './NfcTag.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import PersonFocusYearTag from '../Person/PersonFocusYearTag.svelte';

  let t0_nfc_total_count = 0;
  let t0_nfc_week_count = 0;
  let t0_nfc_month_count = 0;

  let t0_nfc_list = [];
  let t0_persons_table = {};

  let tx_data_ary = [];

  let tab = 't0';

  let open = false;
  let c_4b = true;
  let c_7b = true;
  let c_member = false;
  let list_length = 10;
  const list_length_options = [5, 10, 25, 50, 100, 250, 500, 1000, 2500];

  export const toggle = () => (open = !open);

  const update_view_data = () => {

    const ts_epoch = new Date();
    let tx_int = undefined;
    let search_prefix = 'search/count_';

    if (!c_4b && !c_7b){
      t0_nfc_total_count = 0;
      t0_nfc_week_count = 0;
      t0_nfc_month_count = 0;
      t0_nfc_list = [];
      tx_data_ary = [];
      return;
    }

    if (!(c_4b && c_7b)){
      if (c_4b){
        search_prefix += '4b_';
      } else {
        search_prefix += '7b_';
      }
    }

    if (tab !== 't0'){
      tx_int = parseInt(tab.substring(1));
    }

    /**
     * Only members of the selected year $focus_year
    */

    if (c_member){

      let ts_one_week_ago = ts_epoch.getTime() - (86400000 * 7);
      let ts_one_month_ago = ts_epoch.getTime() - (86400000 * 30);

      let my_nfc_table = {};
      let my_nfc_id_ary = [];

      db_person.allDocs({
        include_docs: true
      }).then((res) => {

        t0_persons_table = {};

        let focus_year_key = 'y' + $focus_year;

        res.rows.forEach((v) => {
          if (typeof v.doc.member_year !== 'object'){
            return;
          }
          if (!v.doc.member_year[focus_year_key])
          {
            return;
          }
          t0_persons_table[v.doc._id] = {...v.doc};
        });

        return db_nfc.query(search_prefix + 'by_ts_epoch', {
          startkey: ts_epoch.getTime() + 86400000,
          descending: true,
          include_docs: true,
          reduce: false
        });

      }).then((res) => {

        t0_nfc_week_count = 0;
        t0_nfc_month_count = 0;
        t0_nfc_total_count = 0;
        t0_nfc_list = [];

        let my_p_count_table = {};
        let my_count_table = {};
        let my_person_ary = [];

        res.rows.forEach((v) => {
          if (t0_persons_table[v.doc.person_id] === undefined){
            return;
          }
          my_nfc_id_ary.push(v.doc._id);
          my_nfc_table[v.doc._id] = {...v.doc};

          if (my_p_count_table[v.doc.person_id] === undefined){
            my_p_count_table[v.doc.person_id] = 0;
          }

          my_p_count_table[v.doc.person_id]++;
        });

        t0_nfc_total_count = my_nfc_id_ary.length;

        my_nfc_id_ary.every((id) => {
          t0_nfc_list.push(my_nfc_table[id]);
          return t0_nfc_list.length < list_length;
        });

        my_nfc_id_ary.every((id) => {
          t0_nfc_week_count++;

          console.log('---- NFC ID WEEK ---', id);
          return my_nfc_table[id].ts_epoch > ts_one_week_ago;
        });

        my_nfc_id_ary.every((id) => {
          t0_nfc_month_count++;
          return my_nfc_table[id].ts_epoch > ts_one_month_ago;
        });

        Object.entries(my_p_count_table).forEach((a) => {

          /**
           * a[0] person_id
           * a[1] nfc_count
          */

          if (my_count_table[a[1]] === undefined){
            my_count_table[a[1]] = 0;
          }
          my_count_table[a[1]]++;

          if (a[1] !== tx_int){
            return;
          }

          if (my_person_ary.length < list_length){
            my_person_ary.push({...t0_persons_table[a[0]]});
          }
        });

        console.log('--- MY_COUNT_TABLE ---');
        console.log(my_count_table);

        tx_data_ary = [];

        Object.keys(my_count_table).forEach((k) => {
          tx_data_ary.push({
            count_nfcs: parseInt(k),
            count_persons: my_count_table[k],
            person_ary: []
          });
        });

        console.log('my tx_data_ary');
        console.log(tx_data_ary);

        if (tab === 't0'){
          return;
        }

        let tx_index = tx_data_ary.findIndex((el) => el.count_nfcs === tx_int);
        console.log('tx_index', tx_index);

        if (typeof tx_data_ary[tx_index] === 'object'){
          tx_data_ary[tx_index].person_ary = my_person_ary;
        }

      }).catch((err) => {
          console.log(err);
      });

      return;
    }

    /**
     * Focus year NOT selected
    */

    /**
     * data for tab t0
     */

    db_nfc.query(search_prefix + 'by_ts_epoch', {

      startkey: ts_epoch.getTime() + 86400000,
      descending: true,
      include_docs: true,
      limit: list_length,
      reduce: false

    }).then((res) => {

      console.log('nfc limit ' + list_length);
      console.log(res);

      t0_nfc_total_count = res.total_rows;

      let person_keys = [];
      t0_nfc_list = [];

      res.rows.forEach((v) => {
        t0_nfc_list.push(v.doc);
        person_keys.push(v.doc.person_id);
      });

      console.log('t0_nfc_list', t0_nfc_list);
      console.log('person_keys', person_keys);

      return db_person.allDocs({
        keys: person_keys,
        include_docs: true
      });

    }).then((res) => {

      console.log('t0_persons_table (t0_nfc_list)');
      console.log(res);

      res.rows.forEach((p) => {
        t0_persons_table[p.id] = {...p.doc};
      });

    }).catch((err) => {
      console.log(err);
    });

    /**
     * week
    */

    if (tab === 't0'){

      db_nfc.query(search_prefix + 'by_ts_epoch', {

        endkey: ts_epoch.getTime() + 86400000,
        startkey: ts_epoch.getTime() - (86400000 * 7),

      }).then((res) => {

        console.log(' ---- nfc count week ----');
        console.log(res);

        if (res.rows.length){
          t0_nfc_week_count = res.rows[0].value;
        } else {
          t0_nfc_week_count = 0;
        }

      }).catch((err) => {
        console.log(err);
      });
    }

    /**
     * month
    */

    if (tab === 't0'){

      db_nfc.query(search_prefix + 'by_ts_epoch', {

        endkey: ts_epoch.getTime() + 86400000,
        startkey: ts_epoch.getTime() - (86400000 * 30),

      }).then((res) => {

        console.log(' ---- nfc count month ----');
        console.log(res);

        if (res.rows.length){
          t0_nfc_month_count = res.rows[0].value;
        } else {
          t0_nfc_month_count = 0;
        }

      }).catch((err) => {
        console.log(err);
      });
    }

    /**
     * data for tabs t<x> (tx_int !== undefined)
    */

    db_nfc.query(search_prefix + 'by_person_id', {
      group: true
    }).then((res) => {

      console.log('COUNT_BY_PERSON_ID');
      console.log(res);

      let person_keys = [];
      let count_table = {};
      tx_data_ary = [];

      res.rows.forEach((v) => {

        /**
         * v.value is number of nfcs for a person
        */

        if (count_table[v.value] === undefined){
          count_table[v.value] = 0;
        }

        count_table[v.value]++;

        /**
         * person_keys to fetch for a t<number> tab
        */
        if (v.value === tx_int){
          if (person_keys.length < list_length){
            person_keys.push(v.key);
          }
        }
      });

      console.log('-- %% nfc_person count_table %% --');
      console.log(count_table);

      Object.keys(count_table).forEach((k) => {
        tx_data_ary.push({
          count_nfcs: parseInt(k),
          count_persons: count_table[k],
          person_ary: []
        });
      });

      console.log('tx_data_ary');
      console.log(tx_data_ary);

      if (tab === 't0'){
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

      let index = tx_data_ary.findIndex((el) => el.count_nfcs === tx_int);
      console.log('index', index);

      if (typeof tx_data_ary[index] === 'object'){
        tx_data_ary[index].person_ary = person_ary;
      }

    }).catch((err) => {
        console.log(err);
    });
  };

  $: {
    c_4b;
    c_7b;
    c_member;
    tab;
    open;
    $nfc_count;
    list_length;
    update_view_data();
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
          <select id=list_length bind:value={list_length} class=form-control name=list_length on:change={() => update_view_data()}>
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
        <div class=form-check title="Filter op leden in lidjaar">
          <input class=form-check-input type=checkbox id=c_member bind:checked={c_member}>
          <label class=form-check-label for=c_member>
            Enkel leden <PersonFocusYearTag />
          </label>
        </div>
      </Col>
    </Row>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      <TabPane tabId=t0 active={tab === 't0'}>
        <span slot=tab>
          Totaal: {t0_nfc_total_count}
        </span>
        <div>
          Laatste week
            <Badge color=accent>
              {t0_nfc_week_count}
            </Badge>
          Laatste maand
            <Badge color=accent>
              {t0_nfc_month_count}
            </Badge>
        </div>
        <ListGroup>
          {#each t0_nfc_list as n(n._id)}
            <SelectableListGroupItem
              active={$person && $person._id === n.person_id}
              on:click={() => $person = t0_persons_table[n.person_id]}
            >
              <Row>
                <Col md=6>
                  <NfcTag nfc={n} />
                </Col>
                <Col>
                  {#if t0_persons_table[n.person_id]}
                    <PersonTag person={t0_persons_table[n.person_id]} show_member_year />
                  {/if}
                </Col>
              </Row>
            </SelectableListGroupItem>
          {/each}
        </ListGroup>
      </TabPane>
      {#each tx_data_ary as np(np.count_nfcs)}
      <TabPane tabId={'t' + np.count_nfcs} active={tab === ('t' + np.count_nfcs)}>
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
