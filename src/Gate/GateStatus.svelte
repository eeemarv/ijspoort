<script>
  import { gate_count_enabled, gate_count, gate_nfc_enabled } from "../services/store";
  const { ipcRenderer } = window.require('electron');

  let open = true;

  $: if ($gate_count_enabled && $gate_count <= 0){
    open = false;
  }

  $: if (!$gate_count_enabled || $gate_count > 0){
    open = true;
  }

  $: if (open){
    ipcRenderer.send('gpio.gate.open');
  }

  $: if (!open){
    ipcRenderer.send('gpio.gate.close');
  }
</script>

<span class="badge mr-2"
  class:badge-success={open}
  class:badge-dark={!open}
  title="Poort status"
>
  Poort
</span>

<style>
span {
  font-size: 1.3em;
}
</style>