<script>
  const env = window.require('electron').remote.process.env;
  import { modals } from './../services/store';
  import DbInit from './DbInit.svelte';
  import GateContainer from './GateContainer.svelte';
  import MainContainer from './MainContainer.svelte';

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
