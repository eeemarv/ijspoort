<script>
  const { ipcRenderer } = window.require('electron');

  let show = false;
  const show_time = 500;

  ipcRenderer.on('scan/person_valid_member', (ev, nfc_id) => {
    setTimeout(() => {
      show = false;
    }, show_time); 
    show = true;
  });

</script>

{#if show}
  <li
    class="list-group-item pt-0 pb-0 ps-2 bg-success"
  >
  <div class="row ps-0">
    <div class="col-md-1 b-gate ms-0">
      <h3>POORT</h3>
    </div>
    <div class="col-md pt-2 pb-2">
      Ok
    </div>
  </div>
  </li>
{/if}

<style>
li {
  border-bottom:  1px solid lightgrey;
}
div.b-gate{
  background-color: #040;
  border-right: 1px solid lightgrey;
}
h3 {
  font-size: .8em;
  line-height: 2em;
}
</style>
