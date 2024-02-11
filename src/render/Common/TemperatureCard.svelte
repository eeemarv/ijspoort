<script>
  const { ipcRenderer } = window.require('electron');
  import { Card } from 'sveltestrap';
  import { onMount } from 'svelte';

  export let horizontal = false;
  export let font_size = '1em';

  const water_temp_valid_time = 60000;
  const air_temp_valid_time = 60000;
  let water_temp;
  let air_temp;
  let water_temp_timeout_id;
  let air_temp_timeout_id;

  onMount(() => {

    ipcRenderer.on('water_temp', (ev, temp_str) => {
      window.clearTimeout(water_temp_timeout_id);
      water_temp_timeout_id = window.setTimeout(() => {
        water_temp = undefined;
      }, water_temp_valid_time);
      water_temp = parseFloat(temp_str);
    });

    ipcRenderer.on('air_temp', (ev, temp_str) => {
      window.clearTimeout(air_temp_timeout_id);
      air_temp_timeout_id = window.setTimeout(() => {
        air_temp = undefined;
      }, air_temp_valid_time);
      air_temp = parseFloat(temp_str);
    });
  });
</script>

<Card body class=my-2 >
  <div
    class="w-100 justify-content-between"
    class:d-flex={horizontal}
    style="font-size: {font_size};"
  >
    <div>
      Water:&nbsp;
      <span class="fw-bold">
        {#if typeof water_temp === 'number'}
          {water_temp.toLocaleString('nl-NL', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          })}
        {:else}
          --,-
        {/if}
      </span>°C
    </div>
    <div>
      Lucht:&nbsp;
      <span class="fw-bold">
        {#if typeof air_temp === 'number'}
          {air_temp.toLocaleString('nl-NL', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
          })}
        {:else}
          --,-
        {/if}
      </span>°C
    </div>
  </div>
</Card>

<style>
  span {
    font-size: var(--font-size);
  }
</style>
