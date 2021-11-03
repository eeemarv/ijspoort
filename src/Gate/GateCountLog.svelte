<script>
  const { ipcRenderer } = window.require('electron');
  import { db_gate } from '../services/db';

  const hours = 3;

  ipcRenderer.on('sensor_log.gate_count.get', async (ev) => {
    let gate_count = 0;
    let now = new Date();
    let ts_epoch = now.getTime();
    try {
      let res_in = await db_gate.query('search/count_in_by_ts_epoch', {
        startkey: ts_epoch - (hours * 3600000),
        endkey: ts_epoch,
        reduce: true
      });
      let res_out = await db_gate.query('search/count_out_by_ts_epoch', {
        startkey: ts_epoch - (hours * 3600000),
        endkey: ts_epoch,
        reduce: true
      });
      if (res_in.rows.length){
        gate_count += res_in.rows[0].value;
      }
      if (res_out.rows.length){
        gate_count -= res_out.rows[0].value;
      }
      if (gate_count < 0){
        gate_count = 0;
      }

      ipcRenderer.send('sensor_log.gate_count.ok', gate_count);
      console.log('sensor_log.gate_count.ok');
      console.log(gate_count);
    } catch (err) {
      ipcRenderer.send('sensor_log.gate_count.fail');
      console.log('sensor_log.gate_count.fail');
      console.log(err);
    }
  });
</script>
