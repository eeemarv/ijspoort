<script>
  const env = window.require('electron').remote.process.env;
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher, onMount } from 'svelte';
  import { gate_count } from '../services/store';
  import { gate_count_enabled } from '../services/store';
  import { gate_in_map } from '../services/store';
  import { gate_out_map } from '../services/store';
  import { gate_in_add } from '../services/gate';
  import { gate_out_add } from '../services/gate';

  // hold person and nfc_uid data until gate closes
  export let gate_person = undefined;
  export let gate_nfc_uid = undefined;
  export let font_size = '1em';

  const debug_enabled = env.DEBUG === '1';
  const gate_enabled = env.GATE === '1';
  const emulate_sens_in_out = env.EMULATE_SENS_IN_OUT === '1';
  const dispatch = createEventDispatcher();

  const fresh_triggered_time = 10000;
  const show_triggered_time = 1000;

  let triggered_in = false;
  let trigger_in;
  let handle_click_in;
  let triggered_out = false;
  let trigger_out;
  let handle_click_out;

  onMount(() => {

    trigger_in = () => {
      if ($gate_count_enabled){
        gate_count.dec();
      }
      gate_in_add(gate_person._id, gate_nfc_uid);
      gate_person = undefined;
      gate_nfc_uid = undefined;
      dispatch('triggered_in');
    };

    trigger_out = () => {
      if ($gate_count_enabled){
        gate_count.inc();
      }
      gate_out_add();
      dispatch('triggered_out');
    };

    handle_click_in = () => {
      if (debug_enabled && emulate_sens_in_out){
        trigger_in();
      } else if (!gate_enabled){
        dispatch('click');
      }
    };

    handle_click_out = () => {
      if (debug_enabled && emulate_sens_in_out){
        trigger_out();
      } else if (!gate_enabled){
        dispatch('click');
      }
    };

    ipcRenderer.on('sens.in', (ev) => {
      trigger_in();
    });

    ipcRenderer.on('sens.out', (ev) => {
      trigger_out();
    });
  });

  $:if ($gate_in_map.size && [...$gate_in_map.values()].pop().ts_epoch > ((new Date()).getTime() - fresh_triggered_time)){
    triggered_in = true;
    setTimeout(() => {
      triggered_in = false;
    }, show_triggered_time);
  }

  $:if ($gate_out_map.size && [...$gate_out_map.values()].pop().ts_epoch > ((new Date()).getTime() - fresh_triggered_time)){
    triggered_out = true;
    setTimeout(() => {
      triggered_out = false;
    }, show_triggered_time);
  }
</script>

<span class="badge me-1"
  style="--font-size: {font_size};"
  class:bg-success={triggered_in}
  class:bg-dark={!triggered_in}
  title="Ingangssensor"
  on:click={() => handle_click_in()}
  on:keyup={() => {}}
>
  In: {$gate_in_map.size}
</span>

<span class="badge me-1"
  style="--font-size: {font_size};"
  class:bg-success={triggered_out}
  class:bg-dark={!triggered_out}
  title="Uitgangssensor"
  on:click={() => handle_click_out()}
  on:keyup={() => {}}
>
  Uit: {$gate_out_map.size}
</span>

<style>
span {
  font-size: var(--font-size);
}
</style>