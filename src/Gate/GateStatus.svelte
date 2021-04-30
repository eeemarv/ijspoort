<script>
  import { onMount } from "svelte";
  import { gate_count_enabled, gate_nfc_enabled } from "../services/store";
  const { ipcRenderer } = window.require('electron');

  let normally_closed = false;
  let open = true;
  $: normally_closed = $gate_count_enabled || $gate_nfc_enabled;

  /*
  onMount(() => {
    const sync_status_interval = setInterval(() => {
      ipcRenderer.invoke('gpio.gate.sync')
      .then((res) => {
        open = res;
      });
    }, 200);
    return () => {
      clearInterval(sync_status_interval);
    }
  });

  const close_gate = () => {
    ipcRenderer.send('gpio.gate.close');

  }


  const open_gate = () => {
    ipcRenderer.send('gpio.gate.open');
    if (normally_closed){
      const close_time_out = setTimeout(() => {
        close_gate();
      });
    }

  }
  */


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