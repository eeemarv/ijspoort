<script>
  import { createEventDispatcher } from 'svelte';
  import { gate_in_map } from '../../services/store';
  import { gate_out_map } from '../../services/store';
  import { handle_sens_in } from '../../gate/gate_trigger';
  import { handle_sens_out } from '../../gate/gate_trigger';

  const dispatch = createEventDispatcher();

  export let font_size = '1em';

  const fresh_triggered_time = 10000;
  const show_triggered_time = 1000;

  let triggered_in = false;
  let triggered_out = false;

  const handle_click_in = () => {
    if (window.bridge.envDebugEnabled() && window.bridge.envEmulateSensEnabled()){
      handle_sens_in();
    } else if (!window.bridge.envKioskEnabled()){
      dispatch('click');
    }
  };

  const handle_click_out = () => {
    if (window.bridge.envDebugEnabled() && window.bridge.envEmulateSensEnabled()){
      handle_sens_out();
    } else if (!window.bridge.envKioskEnabled()){
      dispatch('click');
    }
  };

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
  on:keyup
  role="button"
  tabindex="-1"
>
  In: {$gate_in_map.size}
</span>

<span class="badge me-1"
  style="--font-size: {font_size};"
  class:bg-success={triggered_out}
  class:bg-dark={!triggered_out}
  title="Uitgangssensor"
  on:click={() => handle_click_out()}
  on:keyup
  role="button"
  tabindex="-1"
  >
  Uit: {$gate_out_map.size}
</span>

<style>
span {
  font-size: var(--font-size);
}
</style>