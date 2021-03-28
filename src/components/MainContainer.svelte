<script>
  import { Container, Row } from 'sveltestrap';
  import RegCSVExport from './RegCSVExport.svelte';
  import DbJSONExport from './DbJSONExport.svelte';
  import MainPage from './MainPage.svelte';

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

<RegCSVExport />
<DbJSONExport />

<Container fluid=true>
  <Row class=vh-100>
      <MainPage />
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
