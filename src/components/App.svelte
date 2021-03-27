<script>
  const env = window.require('electron').remote.process.env;
  import MainPage from './MainPage.svelte';
  import { Container, Row } from 'sveltestrap';
  import GatePage from './GatePage.svelte';
  import { modals } from './../services/store';

  const gate_modus_enabled = env.GATE_MODUS === '1';

  let mods = [];
  $: mods = Object.values($modals);

</script>

{#each mods as mod}
  <svelte:component this={mod.component} {...mod.props} />
{/each}

<Container fluid=true>
  <Row class=vh-100>
    {#if gate_modus_enabled}
      <GatePage />
    {:else}
      <MainPage />
    {/if}
  </Row>
</Container>
