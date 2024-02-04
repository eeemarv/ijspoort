<script>
  const env = window.require('electron').remote.process.env;
  import DeskContainer from '../../render_desk/Desk/DeskContainer.svelte';
  import GatePage from '../../render_gate/Gate/GatePage.svelte';
  import AppInit from './AppInit.svelte';
  import { listen_nfc } from '../../nfc/nfc_scan';
  import { listen_nfc_device } from '../../nfc/nfc_device';
  import { listen_gate_open } from '../../gate/gate_monitor';

  listen_nfc();
  listen_nfc_device();
  listen_gate_open();
</script>

<AppInit />

{#if env.GATE === '1'}
  <GatePage />
{:else}
  <DeskContainer />
{/if}
