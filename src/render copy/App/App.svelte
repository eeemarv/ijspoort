<script>
  const env = window.require('electron').remote.process.env;
  import DbInit from '../Db/DbInit.svelte';
  import MainContainer from '../../render_desk/Main/MainContainer.svelte';
  import GatePage from '../../render_gate/Gate/GatePage.svelte';

  const gate_enabled = env.GATE === '1';
</script>

<DbInit />

{#if gate_enabled}
  <GatePage />
{:else}
  <MainContainer />
{/if}
