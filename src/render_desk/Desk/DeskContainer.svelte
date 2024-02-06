<script>
  import { Container, Row } from 'sveltestrap';
  import DbRegCSVExport from '../Db/DbRegCSVExport.svelte';
  import DbRegCountCSVExport from '../Db/DbRegCountCSVExport.svelte';
  import DbJSONExport from '../Db/DbJSONExport.svelte';
  import Config from '../Config/Config.svelte';
  import DeskPage from './DeskPage.svelte';
  import DbAssistImport from '../Db/DbAssistImport.svelte';

  let y;
  let el_btn_to_top;

  const handle_to_top = (() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });

  const handle_scroll = () => {
    if (y > 50){
      el_btn_to_top.style.visibility = 'visible';
    } else {
      el_btn_to_top.style.visibility = 'hidden';
    }
  };

  
</script>

<svelte:window on:scroll={handle_scroll} bind:scrollY={y}/>

<DbRegCSVExport />
<DbRegCountCSVExport />
<DbJSONExport />
<DbAssistImport />
<Config />

<Container fluid>
  <Row class=min-vh-100>
    <DeskPage />
  </Row>
</Container>

<button class="btn btn-info" on:click={handle_to_top} bind:this={el_btn_to_top} title="Ga naar boven">
  &Hat; TOP
</button>

<style>
  button {
    right: 0;
    bottom: 0;
    position: fixed;
    visibility: hidden;
  }
</style>
