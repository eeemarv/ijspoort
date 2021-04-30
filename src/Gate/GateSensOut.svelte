<script>
  const env = window.require('electron').remote.process.env;
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher } from 'svelte';
  import { gate_count_enabled, gate_count } from '../services/store';
  import GateSens from './GateSens.svelte';

  const debug = env.DEBUG === '1';
  const dispatch = createEventDispatcher();

  let triggered = false;

  const trigger = () => {
    if ($gate_count_enabled){
      gate_count.inc();
    }
    dispatch('triggered');
    triggered = true;
    setTimeout(() => {
        triggered = false;
    }, 1000);
  }

  const handle_click = () => {
    if (debug){
      trigger();
    }
  };

  ipcRenderer.on('sens.out', (ev) => {
    trigger();
  });
</script>

<GateSens
  title="Uitgangssensor"
  {triggered}
  on:click={() => handle_click()}
>
  Uit
</GateSens>