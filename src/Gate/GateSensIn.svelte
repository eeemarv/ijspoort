<script>
  const env = window.require('electron').remote.process.env;
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher } from 'svelte';
  import { gate_count, gate_count_enabled } from '../services/store';
  import GateSens from './GateSens.svelte';

  const debug = env.DEBUG === '1';
  const dispatch = createEventDispatcher();

  let triggered = false;

  const trigger = () => {
    triggered = true;
    dispatch('triggered');
    setTimeout(() => {
        triggered = false;
    }, 1000);
    if ($gate_count_enabled){
      gate_count.dec();
    }
  }

  const handle_click = () => {
    if (debug){
      trigger();
    }
  };

  ipcRenderer.on('gpio.sens.in', (ev) => {
    trigger();
  });
</script>

<GateSens
  title="Ingangssensor"
  {triggered}
  on:click={() => handle_click()}
>
  In
</GateSens>