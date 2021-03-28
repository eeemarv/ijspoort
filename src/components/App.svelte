<script>
  const env = window.require('electron').remote.process.env;
  import { modals } from './../services/store';
  import DbInit from './DbInit.svelte';
  import GateContainer from './GateContainer.svelte';
  import MainContainer from './MainContainer.svelte';

  const gate_modus_enabled = env.GATE_MODUS === '1';

  let mods = [];
  $: mods = Object.values($modals);

</script>

<DbInit />

{#each mods as mod}
  <svelte:component this={mod.component} {...mod.props} />
{/each}

{#if gate_modus_enabled}
  <GateContainer />
{:else}
  <MainContainer />
{/if}
