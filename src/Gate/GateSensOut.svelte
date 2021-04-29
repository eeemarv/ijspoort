<script>
  const env = window.require('electron').remote.process.env;
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher } from 'svelte';
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
  }

  const handle_click = () => {
    if (debug){
      trigger();
    }
  };

  ipcRenderer.on('gpio.sens.out', (ev) => {
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