<script>
  const env = window.require('electron').remote.process.env;
  import { modals } from '../services/store';
  import DbInit from '../Db/DbInit.svelte';
  import GateContainer from '../Gate/GateContainer.svelte';
  import MainContainer from '../Main/MainContainer.svelte';

  const gate_enabled = env.GATE === '1';

  let mdls = [];
  $: mdls = Object.values($modals);
</script>

<DbInit />

{#each mdls as mdl}
  <svelte:component this={mdl.component} {...mdl.props} />
{/each}

{#if gate_enabled}
  <GateContainer />
{:else}
  <MainContainer />
{/if}
