<script>
  const env = window.require('electron').remote.process.env;
  import MainPage from './MainPage.svelte';
  import { Container, Row } from 'sveltestrap';
  import GatePage from './GatePage.svelte';

  const gate_modus_enabled = env.GATE_MODUS === '1';
</script>

<Container fluid=true>
  <Row class=vh-100>
    {#if gate_modus_enabled}
      <GatePage />
    {:else}
      <MainPage />
    {/if}
  </Row>
</Container>
