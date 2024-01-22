<script>
  const env = window.require('electron').remote.process.env;
  import DbInit from '../Db/DbInit.svelte';
  import MainContainer from '../../render_desk/Main/MainContainer.svelte';
  import GatePage from '../../render_gate/Gate/GatePage.svelte';
  import AppInit from './AppInit.svelte';

</script>

<AppInit />

{#if env.GATE === '1'}
  <GatePage />
{:else}
  <MainContainer />
{/if}
