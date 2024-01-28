<script>
  import { ev_nfc_scan } from '../../services/events';
  import { sub_nfc_map } from '../../services/sub';
  import RegAlready from './RegAlready.svelte';

  let person_id = undefined;
  let timeout_id = undefined;
  const show_blocked_time = 1500;

  ev_nfc_scan.addEventListener('already_registered', (e) => {
    if (!sub_nfc_map.has(e.detail.nfc_id)){
      return;
    }
    clearTimeout(timeout_id);
    timeout_id = setTimeout(() => {
      person_id = undefined;
    }, show_blocked_time);
    person_id = sub_nfc_map.get(e.detail.nfc_id).person_id;
  });

</script>

{#if person_id}
  <li
    class="list-group-item bg-warning"
  >
    <div class="d-flex w-100 justify-content-between">
      <div>
        <RegAlready {person_id} />
      </div>
      <div>
      </div>
    </div>
  </li>
{/if}

<style>
li {
  border-bottom:  1px solid darkgrey;
}
</style>
