<script>
  const { ipcRenderer } = window.require('electron');
  import { sub_nfc_map } from '../../services/sub';
  import RegAlready from './RegAlready.svelte';

  let person_id = undefined;
  let timeout_id = undefined;
  const show_blocked_time = 1500;

  ipcRenderer.on('gate.rx.already_registered', (e, nfc_id) => {
    if (!sub_nfc_map.has(nfc_id)){
      return;
    }
    clearTimeout(timeout_id);
    timeout_id = setTimeout(() => {
      person_id = undefined;
    }, show_blocked_time);
    person_id = sub_nfc_map.get(nfc_id).person_id;
  });
</script>

{#if person_id}
  <li
    class="list-group-item bg-danger"
  >
    <div class="d-flex w-100 justify-content-between">
      <div class="bg-purple">
        <h2>Van POORT</h2>
      </div>
      <div>
        <RegAlready {person_id} />        
      </div>
    </div>
  </li>
{/if}

<style>
li {
  border-bottom:  1px solid darkgrey;
}
</style>
