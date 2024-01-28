<script>
  const env = window.require('electron').remote.process.env;
  import DeskContainer from '../../render_desk/Desk/DeskContainer.svelte';
  import GatePage from '../../render_gate/Gate/GatePage.svelte';
  import AppInit from './AppInit.svelte';
  import { listen_nfc } from '../../nfc/nfc_scan';

  listen_nfc();

</script>

<AppInit />

{#if env.GATE === '1'}
  <GatePage />
{:else}
  <DeskContainer />
{/if}
