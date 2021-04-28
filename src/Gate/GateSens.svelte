<script>
  const gpio = require('rpi-gpio');
  const env = window.require('electron').remote.process.env;
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  const debug = env.DEBUG === '1';
  const dispatch = createEventDispatcher();
  const sustain_time = 1000;
  export let pin;
  export let reverse = true;
  let on = false;

  onMount(() => {
    gpio.setup(pin, gpio.DIR_IN, gpio.EDGE_BOTH);
  });
  onDestroy(() => {
    gpio.destroy();
  });

  const handle_interrupt = () => {
    on = true;
    dispatch('pin_interrupt');
    setTimeout(() => {
      on = false;
    }, sustain_time);
  };

  const handle_click = () => {
    if (!debug){
      return;
    }
    handle_interrupt();
  };

  gpio.on('change', (channel, value) => {
    if (channel !== pin){
      return;
    }
    if (on){
      // cancel noise
      return;
    }
    if (reverse && value){
      return;
    }
    if (!reverse && !value){
      return;
    }
    handle_interrupt();
  });
</script>

<span class="badge mr-2"
  class:badge-success={on}
  class:badge-dark={!on}
  title="Poort status"
  on:click={handle_click}
>
  <slot></slot>
</span>

<style>
span {
  font-size: 1.5em;
}
</style>