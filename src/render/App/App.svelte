<script>
  const env = window.require('electron').remote.process.env;
  import DeskContainer from '../../render_desk/Desk/DeskContainer.svelte';
  import GatePage from '../../render_gate/Gate/GatePage.svelte';
  import AppInit from './AppInit.svelte';
  import { listen_nfc } from '../../nfc/nfc_scan';
  import { listen_gate_open } from '../../gate/gate_monitor';

  listen_nfc();
  listen_gate_open();
</script>

<AppInit />

{#if env.GATE === '1'}
  <GatePage />
{:else}
  <DeskContainer />
{/if}
