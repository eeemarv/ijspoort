<script>
  import { onMount } from "svelte";
  const { ipcRenderer } = window.require('electron');
  let open = true;

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