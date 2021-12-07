<script>
  const { ipcRenderer } = window.require('electron');
  import { db_gate, db_sensor } from '../services/db';

  const hours = 3;
  const block_new_log_entry_minutes = 14;

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

  ipcRenderer.on('sensor_log.new_item', async (event, sensor_item) => {
    delete sensor_item.gate_count;
    console.log('****** SENSOR_ITEM ****');
    console.log(sensor_item);
    let now = new Date();
    let ts_epoch = now.getTime();
    let ts_treshold = ts_epoch - (block_new_log_entry_minutes * 60000);
    try {
      let resp = await db_sensor.allDocs({
        startkey: 's' + ts_treshold
      });
      console.log('resp db_sensor');
      console.log(resp);
      if (resp.rows.length){
        console.log('new log entry blocked, not registered in db_sensor.');
        return;
      }
      sensor_item._id = 's' + ts_epoch.toString();
      sensor_item.ts_epoch = ts_epoch;
      await db_sensor.put(sensor_item);
      console.log('sensor item registered');
    } catch (err) {
      console.log('sensor_log.new_item.err');
      console.log(err);
    }
  });
</script>
