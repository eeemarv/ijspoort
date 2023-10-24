<script>
  const { ipcRenderer } = window.require('electron');
  import { assist_import } from '../services/assist_import';
  import { assist_import_year } from '../services/store';

  $: {
    $assist_import_year;
    ipcRenderer.send('rebuild_menu');
  }

  ipcRenderer.on('xls.assist.import', (ev, file) => {
    if (!$assist_import_year){
      return;
    }
    if ($assist_import_year < 2010){
      return;
    }
    if ($assist_import_year > 2030){
      return;
    }
    assist_import(file, $assist_import_year.toString());
  });
</script>
