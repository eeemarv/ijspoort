<script>
  import { Row, Col } from 'sveltestrap';
  import { TabPane } from 'sveltestrap';
  import DaysPeriodInput from './DaysPeriodInput.svelte';
  import DaysOffsetInput from './DaysOffsetInput.svelte';
  import AwaitError from '../../Await/AwaitError.svelte';
  import Await from '../../Await/Await.svelte';
  import { gate_get_person_in_count } from '../../db_get/gate_get';
  import { reg_map } from '../../services/store';

  export let tab;

  let days = 30;
  let days_offset = 0;

  const suppress_time = 18000000;  // 5 hours

  const update_view = async () => {
    const ts_epoch = (new Date()).getTime();
    const ts_end = ts_epoch - (days_offset * 86400000);
    const ts_start = ts_end - (days * 86400000);

    const entries_map = new Map();

    let visit_count = 0;
    const visit_ary = [];

    const res = await gate_get_person_in_count(ts_start, ts_end, suppress_time);

    res.person_count_map.forEach((v) => {
      entries_map.set(v, (entries_map.get(v) ?? 0) + 1);
      visit_count += v;
    });

    [...entries_map.keys()].sort((a, b) => a - b).forEach((v) => {
      visit_ary.push({
        visit_count: v,
        person_count: entries_map.get(v),
      });
    });

    return {
      total_visit_count: visit_count,
      suppressed_count: res.suppressed_count,
      person_count: res.person_count_map.size,
      visit_ary: [...visit_ary]
    };
  };

</script>

<TabPane tabId=count_unique active={tab === 'count_unique'}>
  <span slot=tab>
    Zwembeurten
  </span>
  <Row>
    <Col>
      <DaysPeriodInput bind:days />
    </Col>
    <Col>
      <DaysOffsetInput bind:days_offset />
    </Col>
  </Row>
  <Row>
    <Col>
      {#if tab === 'count_unique'}
      {#await update_view(days, days_offset, $reg_map)}
        <Await />
      {:then res}
        <table>
          <thead>
            <tr>
              <th colspan=2>
                {days} dagen: aantal (unieke) personen: {res.person_count}
              </th>
            </tr>
            <tr>
              <th>Zwembeurten</th>
              <th>Aantal personen</th>
            </tr>
          </thead>
          <tbody>
            {#each res.visit_ary as v, index (index)}
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
                Aantal zwembeurten uitgefilterd (zelfde persoon binnen {suppress_time / 3600000} uur): {res.suppressed_count}
              </td>
            </tr>
            <tr>
              <td colspan=2>
                Aantal zwembeurten (gefilterd): {res.total_visit_count}
              </td>
            </tr>
          </tfoot>
        </table>
      {:catch error}
        <AwaitError {error} />
      {/await}
      {/if}
    </Col>
  </Row>
</TabPane>
