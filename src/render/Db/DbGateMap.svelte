<script>
  import { db_gate } from '../services/db';
  import { gate_in_map } from '../services/store';
  import { gate_out_map } from '../services/store';
  import { sub_gate_in_map } from '../services/sub';
  import { sub_gate_out_map } from '../services/sub';

  const ms_period = 18000000; // view regs last 5 hours
  const cleanup_interval = 60000; // cleanup view regs every minute

  const listen_changes = () => {

    console.log('-- LISTEN CHANGES DB_REG --');

    db_gate.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {

      if (!change.id.startsWith('g'))
      {
        return;
      }

      /**
       * Normally gate entries are not deleted
       * here maps sync added for completeness:
      */
      if (change.deleted){

        if (sub_gate_in_map.has(change.id)){
          gate_in_map.update((m) => {
            m.delete(change.id);
            return m;
          });

          console.log('== $gate_in_map deleted: ', change);
          return;
        }

        if (sub_gate_out_map.has(change.id)){
          gate_out_map.update((m) => {
            m.delete(change.id);
            return m;
          });

          console.log('== $gate_out_map deleted: ', change);
          return;
        }

        console.log('== change del ', change);
        return;
      }

      if (change.doc.in){
        gate_in_map.update((m) => {
          m.set(change.id, {...change.doc});
          return m;
        });
        console.log('== change $gate_in_map ', change);
        return;
      }

      if (change.doc.out){
        gate_out_map.update((m) => {
          m.set(change.id, {...change.doc});
          return m;
        });
        console.log('== change $gate_out_map ', change);
        return;
      }

      console.log('== db_gate change, not stored in map.', change);
      return;

    }).on('error', (err) => {
      console.log(err);
    });
  };

  const cleanup = () => {
    setInterval(() => {
      const ts_start = (new Date()).getTime() - ms_period;
      const delete_in_keys = [];
      const delete_out_keys = [];

      for (const [k, v] of sub_gate_in_map){

        console.log('GATE_IN_MAP CLEANUP _');
        console.log('K', k);
        console.log('V', v);

        if (v.ts_epoch > ts_start){
          break;
        }

        delete_in_keys.push(k);
      }

      if (delete_in_keys.length){

        gate_in_map.update((m) => {
          delete_in_keys.forEach((k) => {
            m.delete(k);
          });
          return m;
        });

        console.log('==$gate_in_map cleanup, ' + delete_in_keys.length + ' deleted ==');
      }

      for (const [k, v] of sub_gate_out_map){

        console.log('GATE_OUT_MAP CLEANUP _');
        console.log('K', k);
        console.log('V', v);

        if (v.ts_epoch > ts_start){
          break;
        }

        delete_out_keys.push(k);
      }

      if (delete_out_keys.length){

        gate_out_map.update((m) => {
          delete_out_keys.forEach((k) => {
            m.delete(k);
          });
          return m;
        });

        console.log('==$gate_out_map cleanup, ' + delete_out_keys.length + ' deleted ==');
      }
    }, cleanup_interval);
  };

  db_gate.allDocs({
    include_docs: true,
    startkey: 'g' + ((new Date()).getTime() - ms_period)
  }).then((res) => {

    console.log('load $gate_in_map && $gate_out_map RES');
    console.log(res);

    if (res.rows !== undefined && res.rows.length){
      gate_in_map.update((m) => {
        res.rows.forEach((v) => {
          if (v.doc.in === true){
            m.set(v.id, {...v.doc});
          }
        });
        return m;
      });

      gate_out_map.update((m) => {
        res.rows.forEach((v) => {
          if (v.doc.out === true){
            m.set(v.id, {...v.doc});
          }
        });
        return m;
      });
    }

    console.log('=====$gate_in_map====');
    console.log(sub_gate_in_map);
    console.log('=====$gate_out_map====');
    console.log(sub_gate_out_map);

    listen_changes();
    cleanup();

  }).catch((err) => {
    console.log(err);
  });

</script>
