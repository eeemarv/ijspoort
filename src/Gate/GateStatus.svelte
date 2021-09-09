<script>
  const { ipcRenderer } = window.require('electron');
  import { onMount } from "svelte";
  import { gate_count_enabled, gate_count, gate_nfc_enabled } from "../services/store";
  import GateSensIn from "./GateSensIn.svelte";
  import GateSensOut from "./GateSensOut.svelte";

  const nfc_open_time = 100;
  let nfc_open_timer = -1;
  let open = true;

  const set_open = () => {
    console.log('send -> gate.open');
    ipcRenderer.send('gate.open', {});
  };

  const set_close = () => {
    console.log('send -> gate.close');
    nfc_open_timer = -1;
    ipcRenderer.send('gate.close', {});
  }

  ipcRenderer.on('gate.is_open', (ev) => {
    open = true;
  });

  ipcRenderer.on('gate.open.err', (ev) => {
    console.log('GATE.OPEN.ERR');
    open = true;
  });

  ipcRenderer.on('gate.is_closed', (ev) => {
    open = false;
  });

  ipcRenderer.on('gate.close.err', (ev) => {
    console.log('GATE.CLOSE.ERR');
    open = false;
  });

	onMount(() => {
		const nfc_down_timer = setInterval(() => {
      if (nfc_open_timer >= 0){
        nfc_open_timer--;
      }
      if (nfc_open_timer === 0
        && $gate_nfc_enabled
      ){
        set_close();
      }
    }, 100);
		return () => {
			clearInterval(nfc_down_timer);
		};
  });

  export const open_gate_by_nfc = (person) => {
    if ($gate_count_enabled && ($gate_count <= 0)){
      return;
    }
    nfc_open_timer = nfc_open_time;
    set_open();
  };

  $: if ($gate_nfc_enabled){
    handle_close_trigger();
  }

  $: if (!$gate_nfc_enabled){
    handle_open_trigger();
  }

  $: if ($gate_count_enabled){
    handle_close_trigger();
  }

  $: if (!$gate_count_enabled){
    handle_open_trigger();
  }

  $: if ($gate_count > 0){
    handle_open_trigger();
  }

  $: if ($gate_count <= 0){
    handle_close_trigger();
  }

  const handle_close_trigger = () => {
    if ($gate_nfc_enabled){
      set_close();
      return;
    }
    if ($gate_count_enabled && ($gate_count <= 0)){
      set_close();
      return;
    }
  };

  const handle_open_trigger = () => {
    if ($gate_nfc_enabled){
      return;
    }
    if ($gate_count_enabled && ($gate_count <= 0)){
      return;
    }
    set_open();
  };
</script>

<span class="badge me-2"
  class:bg-success={open}
  class:bg-dark={!open}
  title="Poort status"
>
  Poort
</span>

<GateSensIn on:triggered={handle_close_trigger} />
<GateSensOut on:triggered={handle_open_trigger} />

<style>
span {
  font-size: 1.3em;
}
</style>