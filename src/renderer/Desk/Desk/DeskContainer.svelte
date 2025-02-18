<script>
  import { Container, Row } from 'sveltestrap';
  import DbRegCsvExport from '../Db/DbRegCsvExport.svelte';
  import DbRegCountCsvExport from '../Db/DbRegCountCsvExport.svelte';
  import DbJsonExport from '../Db/DbJsonExport.svelte';
  import Config from '../Config/Config.svelte';
  import DeskPage from './DeskPage.svelte';
  import { listen_tag_nfc_auto } from '../../tag/tag_nfc_auto';
  import DataUpdateImport from '../DataUpdate/DataUpdateImport.svelte';
  import DataUpdateRemove from '../DataUpdate/DataUpdateRemove.svelte';
  import DataUpdateCleanup from '../DataUpdate/DataUpdateCleanup.svelte';
  import DbPersonRegCountCsvExport from '../Db/DbPersonRegCountCsvExport.svelte';

  listen_tag_nfc_auto();

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

<DataUpdateImport />
<DataUpdateRemove />
<DataUpdateCleanup />
<DbRegCsvExport />
<DbRegCountCsvExport />
<DbPersonRegCountCsvExport />
<DbJsonExport />
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
