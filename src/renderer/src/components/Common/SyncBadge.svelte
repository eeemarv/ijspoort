<script>
  import { ev_db_sync } from '../../services/events';

  export let font_size = '1em';

  const color_sync_map = {
    paused: 'warning',
    error: 'danger',
    active: 'success',
    change: 'success',
    complete: 'success',
    denied: 'danger'
  };

  let color_connect = 'warning';
  let color_sync = 'warning';

  ev_db_sync.addEventListener('sync', (e) => {
    color_sync = color_sync_map[e.detail.type];
  });

  ev_db_sync.addEventListener('connected', (e) => {
    color_connect = 'success';
  });

  ev_db_sync.addEventListener('not_connected', (e)=> {
    color_connect = 'danger';
  });
</script>

<div style="--font-size: {font_size};">
  <span class="badge bg-{color_sync} me-1" title="synchronisatie met remote database">
    Sync
  </span>
  <span class="badge bg-{color_connect}" title="remote database verbinding">
    DB
  </span>
</div>

<style>
span {
  font-size: var(--font-size);
}
</style>
