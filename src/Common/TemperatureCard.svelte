<script>
  import { Card } from 'sveltestrap';
  import { db_sensor } from '../services/db';
  import { onMount } from 'svelte';

  export let horizontal = false;

  let to;
  let water_temp;
  let air_temp;
  let water_temp_timeout_ary = [];
  let air_temp_timeout_ary = [];
  const timeout = 3600000;

  const init_temps = () => {
    let ts_date = new Date(Date.now() - timeout);
    db_sensor.allDocs({
      endkey: 's' + ts_date.getTime().toString(),
      include_docs: true,
      limit: 1,
      descending: true
    }).then((res) => {
      console.log('++ init temps ++');
      console.log(res);
      if (res.rows.length){
        if (typeof res.rows[0].doc.water_temp === 'number'){
          water_temp = res.rows[0].doc.water_temp;
        }
        if (typeof res.rows[0].doc.air_temp === 'number'){
          air_temp = res.rows[0].doc.air_temp;
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  onMount(() => {
    db_sensor.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      console.log('db_sensor change');
      console.log(change);
      if (typeof change.doc.water_temp === 'number'){
        while (to = water_temp_timeout_ary.pop()){
          clearTimeout(to);
        }
        water_temp_timeout_ary.push(setTimeout(() => {
          water_temp = undefined;
        }, timeout));
        water_temp = change.doc.water_temp;
      }
      if (typeof change.doc.air_temp === 'number'){
        while (to = air_temp_timeout_ary.pop()){
          clearTimeout(to);
        }
        air_temp_timeout_ary.push(setTimeout(() => {
          air_temp = undefined;
        }, timeout));
        air_temp = change.doc.air_temp;
      }
    }).on('error', (err) => {
      console.log(err);
    });

    init_temps();
  });
</script>

<Card body class=my-2>
  <div
    class="w-100 justify-content-between"
    class:d-flex={horizontal}
  >
    <div>
      Water:&nbsp;
      <span class="fw-bold">
        {#if water_temp}
          {water_temp.toLocaleString('nl-NL', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          })}
        {:else}
          --,-
        {/if}
      </span>
      °C
    </div>
    <div>
      Lucht:&nbsp;
      <span class="fw-bold">
        {#if air_temp}
          {air_temp.toLocaleString('nl-NL', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          })}
        {:else}
          --,--
        {/if}
      </span>
      °C
    </div>
  </div>
</Card>
