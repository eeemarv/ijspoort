<script>
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher } from "svelte";
  import { gate_count_enabled, gate_count } from "../services/store";
  import { gate_nfc_enabled, gate_nfc_open_time } from "../services/store";
  import GateSens from "./GateSens.svelte";

  const dispatch = createEventDispatcher();

  export let open = true;
  export let font_size = '1.2em';

  // to hold person and nfc_uid data until gate closes
  let gate_person;
  let gate_nfc_uid;

  export const open_trigger = () => {
    if ($gate_nfc_enabled){
      return;
    }

    if ($gate_count_enabled && ($gate_count <= 0)){
      return;
    }

    set_open();
  };

  export const close_trigger = () => {
    if ($gate_nfc_enabled){
      set_close();
      return;
    }
    if ($gate_count_enabled && ($gate_count <= 0)){
      set_close();
      return;
    }
  };

  export const open_gate_by_nfc = (person, nfc_uid) => {
    // gate_count underflow already prevented in GateModal
    gate_person = person;
    gate_nfc_uid = nfc_uid;
    if ($gate_nfc_enabled){
      set_open_once_with_timer();
    } else {
      set_open();
    }
  };

  const set_open_once_with_timer = () => {
    console.log('send -> gate.open_once_with_timer');
    ipcRenderer.send('gate.open_once_with_timer', $gate_nfc_open_time)
  }

  const set_open = () => {
    console.log('send -> gate.open');
    ipcRenderer.send('gate.open', {});
  };

  const set_close = () => {
    console.log('send -> gate.close');
    ipcRenderer.send('gate.close', {});
  }

  const handle_close_trigger = () => {
    close_trigger();
  };

  const handle_open_trigger = () => {
    open_trigger();
  };

  ipcRenderer.on('gate.is_open', (ev) => {
    open = true;
    dispatch('gate_is_open');
  });

  ipcRenderer.on('gate.open.err', (ev) => {
    console.log('GATE.OPEN.ERR');
    open = true;
  });

  ipcRenderer.on('gate.is_closed', (ev) => {
    open = false;
    dispatch('gate_is_closed');
  });

  ipcRenderer.on('gate.close.err', (ev) => {
    console.log('GATE.CLOSE.ERR');
    open = false;
  });

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
</script>

<span class="badge me-1"
  class:bg-success={open}
  class:bg-dark={!open}
  title="Poort status"
  style="font-size: {font_size};"
>
  Poort
</span>

<GateSens
  font_size={font_size}
  on:triggered_in={handle_close_trigger}
  on:triggered_out={handle_open_trigger}
  bind:gate_person
  bind:gate_nfc_uid
/>

<style>
  span {
    font-size: var(--font-size);
  }
</style>