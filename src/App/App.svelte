<script>
  const env = window.require('electron').remote.process.env;
  import DbInit from '../Db/DbInit.svelte';
  import MainContainer from '../Main/MainContainer.svelte';
  import GatePage from '../Gate/GatePage.svelte';
  import NfcCount from '../Nfc/NfcCount.svelte';

  const gate_enabled = env.GATE === '1';
</script>

<DbInit />
<NfcCount />

{#if gate_enabled}
  <GatePage />
{:else}
  <MainContainer />
{/if}
