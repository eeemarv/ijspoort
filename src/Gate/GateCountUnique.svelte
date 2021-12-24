<script>
  import { Row, Col } from 'sveltestrap';
  import { db_gate } from '../services/db';

  const days = 30;
  const suppress_within_hours = 5;
  let person_log = {};
  let visit_log = {};
  let visit_ary = [];
  let suppressed_count = 0;
  let filtered_visit_count = 0;
  let ready = false;

  const update_data = () => {
    ready = false;
    person_log = {};
    visit_log = {};
    visit_ary = [];
    suppressed_count = 0;
    filtered_visit_count = 0;

    let now = new Date();
    let ts_epoch = now.getTime();

    (async () => {
      await db_gate.query('search/count_in_by_ts_epoch', {
        startkey: ts_epoch - (days * 86400000),
        endkey: ts_epoch,
        reduce: false,
        group: false,
        include_docs: true
      }).then((res) => {
        console.log('Count gate in unique');
        console.log('res --- count_in_by_ts_epoch ---');
        console.log(res);
        res.rows.forEach((v) => {
          if (!v.doc){
            return;
          }
          if (!v.doc.person_id){
            return;
          }
          if (person_log[v.doc.person_id]){
            let last_ts = person_log[v.doc.person_id][person_log[v.doc.person_id].length - 1];
            if (last_ts > (v.key - (3600000 * suppress_within_hours))){
              suppressed_count++;
              console.log('suppressed ' + v.key + ' ' + v.doc.person_id + ', count: ' + suppressed_count);
              return;
            }
          } else {
            person_log[v.doc.person_id] = [];
          }
          filtered_visit_count++;
          person_log[v.doc.person_id] = [...person_log[v.doc.person_id], v.key];
        });
      }).catch((err) => {
        console.log(err);
      });

      Object.keys(person_log).forEach((p_id) => {
        let visit_count = person_log[p_id].length;
        let vc_id = 'v' + visit_count.toString().padStart(3, '0');
        if (!visit_log[vc_id]){
          visit_log[vc_id] = 0;
        }
        visit_log[vc_id]++;
      });

      Object.keys(visit_log).sort().forEach((vc_id) => {
        visit_ary = [...visit_ary, {visit_count: Number(vc_id.substring(1)), person_count: visit_log[vc_id]}];
      });

      ready = true;
    })();
  };

  update_data();
</script>

<Row>
  <Col>
    {#if ready}
      <table>
        <thead>
          <tr>
            <th colspan=2>
              Laatste {days} dagen: aantal (unieke) personen: {Object.keys(person_log).length}
            </th>
          </tr>
          <tr>
            <th>Zwembeurten</th>
            <th>Aantal personen</th>
          </tr>
        </thead>
        <tbody>
          {#each visit_ary as v(v.visit_count)}
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

<style>

</style>
