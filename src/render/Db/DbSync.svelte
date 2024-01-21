<script>
  import { onMount } from 'svelte';
  import { sync_monitor } from '../../services/store';
  import { db_remote_reg } from '../db/db';

  export let font_size = '1em';

  const map_sync_color = {
    paused: 'warning',
    error: 'danger',
    active: 'success',
    complete: 'success',
    denied: 'danger'
  };

  let probe_db_color = 'warning';
  let sync_color = 'warning';
  $: sync_color = map_sync_color[$sync_monitor];

	onMount(() => {
    const probe_db_interval = setInterval(() => {
      db_remote_reg.info().then((res) => {
        probe_db_color = 'success';
      }).catch((err) => {
        probe_db_color = 'danger';
        console.log(err);
      });
    }, 3000);
    return () => {
      clearInterval(probe_db_interval);
    };
  });
</script>

<div style="--font-size: {font_size};">
  <span class="badge bg-{sync_color} me-1" title="synchronisatie met remote database">
    Sync
  </span>
  <span class="badge bg-{probe_db_color}" title="remote database verbinding">
    DB
  </span>
</div>

<style>
span {
  font-size: var(--font-size);
}
</style>
