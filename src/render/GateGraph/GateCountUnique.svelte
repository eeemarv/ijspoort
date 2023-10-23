<script>
  import { Row, Col } from 'sveltestrap';
  import { TabPane } from 'sveltestrap';
  import { FormGroup, Label } from 'sveltestrap';
  import { db_gate } from '../services/db';

  export let tab;

  let days = 30;
  let days_offset = 0;
  const suppress_within_hours = 5;
  let person_log = {};
  let visit_ary = [];
  let suppressed_count = 0;
  let filtered_visit_count = 0;
  let ready = false;

  const update_data = () => {
    ready = false;

    let lc_visit_log = {};
    let lc_visit_ary = [];
    let lc_person_log = {};

    let ts_epoch = (new Date()).getTime();
    let endkey = ts_epoch - (days_offset * 86400000);
    let startkey = endkey - (days * 86400000);

    db_gate.query('search/count_in_by_ts_epoch', {
      startkey: startkey,
      endkey: endkey,
      reduce: false,
      group: false,
      include_docs: true
    }).then((res) => {
      console.log('Count gate in unique');
      console.log('res --- count_in_by_ts_epoch ---');
      console.log(res);

      suppressed_count = 0;
      filtered_visit_count = 0;

      res.rows.forEach((v) => {
        if (!v.doc){
          return;
        }
        if (!v.doc.person_id){
          return;
        }
        if (lc_person_log[v.doc.person_id]){
          let last_ts = lc_person_log[v.doc.person_id][lc_person_log[v.doc.person_id].length - 1];
          if (last_ts > (v.key - (3600000 * suppress_within_hours))){
            suppressed_count++;
            console.log('suppressed ' + v.key + ' ' + v.doc.person_id + ', count: ' + suppressed_count);
            return;
          }
        } else {
          lc_person_log[v.doc.person_id] = [];
        }
        filtered_visit_count++;
        lc_person_log[v.doc.person_id] = [...lc_person_log[v.doc.person_id], v.key];
      });

      Object.keys(lc_person_log).forEach((p_id) => {
        let visit_count = lc_person_log[p_id].length;
        let vc_id = 'v' + visit_count.toString().padStart(3, '0');
        if (!lc_visit_log[vc_id]){
          lc_visit_log[vc_id] = 0;
        }
        lc_visit_log[vc_id]++;
      });

      Object.keys(lc_visit_log).sort().forEach((vc_id) => {
        lc_visit_ary = [...lc_visit_ary, {visit_count: Number(vc_id.substring(1)), person_count: lc_visit_log[vc_id]}];
      });

      person_log = lc_person_log;
      visit_ary = lc_visit_ary;

      ready = true;
    }).catch((err) => {
      console.log(err);
    });
  };

  $: {
    days;
    days_offset;
    if (tab === 'count_unique'){
      update_data();
    }
  }

</script>

<TabPane tabId=count_unique active={tab === 'count_unique'}>
  <span slot=tab>
    Zwembeurten
  </span>
  <Row>
    <Col>
      <FormGroup>
        <Label for=days>Periode in dagen</Label>
        <div class="input-group">
          <input type=number
            id=days class=form-control
            bind:value={days}
            min=1 max=3650
            on:keypress={() => update_data()}
          />
        </div>
       </FormGroup>
    </Col>
    <Col>
      <FormGroup>
        <Label for=days_offset>Dagen geleden</Label>
        <div class="input-group">
          <input type=number
            id=days_offset class=form-control
            bind:value={days_offset}
            min=1 max=3650
            on:keypress={() => update_data()}
          />
        </div>
       </FormGroup>
    </Col>
  </Row>
  <Row>
    <Col>
      {#if ready}
        <table>
          <thead>
            <tr>
              <th colspan=2>
                {days} dagen: aantal (unieke) personen: {Object.keys(person_log).length}
              </th>
            </tr>
            <tr>
              <th>Zwembeurten</th>
              <th>Aantal personen</th>
            </tr>
          </thead>
          <tbody>
            {#each visit_ary as v, index (index)}
            <tr>
              <td>
                {v.visit_count}
              </td>
              <td>
                {v.person_count}
              </td>
            </tr>
          {/each}
          </tbody>
          <tfoot>
            <tr>
              <td colspan=2>
                Aantal zwembeurten uitgefilterd (zelfde persoon binnen {suppress_within_hours} uur): {suppressed_count}
              </td>
            </tr>
            <tr>
              <td colspan=2>
                Aantal zwembeurten (gefilterd): {filtered_visit_count}
              </td>
            </tr>
          </tfoot>
        </table>
      {/if}
    </Col>
  </Row>
</TabPane>
