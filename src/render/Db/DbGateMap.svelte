<script>
  import { db_gate } from '../db/db';
  import { gate_in_map } from '../../services/store';
  import { gate_out_map } from '../../services/store';
  import { sub_gate_in_map } from '../../services/sub';
  import { sub_gate_out_map } from '../../services/sub';

  const ms_period = 18000000; // map last 5 hours
  const cleanup_interval = 60000; // cleanup view every minute

  let last_in_ts_epoch = undefined;
  let last_out_ts_epoch = undefined;

  const gate_map_build = async (type = undefined) => {
    return await db_gate.allDocs({
      include_docs: true,
      startkey: 'g' + ((new Date()).getTime() - ms_period),
      endkey: 'g\uffff'
    }).then((res) => {

      console.log('-db_gate allDocs- ', res);

      const gate_ary = res.rows ?? [];

      if (typeof type === 'undefined' || type === 'in'){
        console.log('build gate_in_map -');
        last_in_ts_epoch = undefined;

        gate_in_map.update((m) => {
          m.clear();
          gate_ary.forEach((v) => {
            if (v.doc.in === true){
              m.set(v.id, {...v.doc});
              last_in_ts_epoch = v.doc.ts_epoch;          
            }
          });
          return m;
        });     
      }

      if (typeof type === 'undefined' || type === 'out'){
        console.log('build gate_out_map -');
        last_out_ts_epoch = undefined;

        gate_out_map.update((m) => {
          m.clear();
          res.rows.forEach((v) => {
            if (v.doc.out === true){
              m.set(v.id, {...v.doc});
              last_out_ts_epoch = v.doc.ts_epoch;
            }
          });
          return m;
        });
      }

    }).catch((err) => {
      console.log(err);
    });
  };

  const listen_changes = () => {

    console.log('- listen changes gate map -');

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
      
      const ts_start = (new Date()).getTime() - ms_period;

      if (change.doc.ts_epoch < ts_start){
        console.log('== db_gate.changes, too old, do not map', change);
        return;
      }

      if (change.doc.in){
        if (typeof last_in_ts_epoch === 'undefined' 
        || last_in_ts_epoch < change.doc.ts_epoch){
          /*
          * in sequence, add to gate_in_map
          */

          gate_in_map.update((m) => {
            m.set(change.id, {...change.doc});
            return m;
          });
          last_in_ts_epoch = change.doc.ts_epoch;
          console.log('== change gate_in_map ', change);
          return;
        }

        /*
        * out sequence, rebuild gate_in_map
        */

        console.log('- gate in map out of sequence, rebuild -');
        gate_map_build('in').then(() => {
          console.log('- gate_in_map rebuild done -');
        });

        return;
      }

      if (change.doc.out){
        if (typeof last_out_ts_epoch === 'undefined' 
        || last_out_ts_epoch < change.doc.ts_epoch){
          /*
          * in sequence, add to gate_out_map
          */

          gate_out_map.update((m) => {
            m.set(change.id, {...change.doc});
            return m;
          });
          last_out_ts_epoch = change.doc.ts_epoch;
          console.log('== change gate_out_map ', change);
          return;
        }

        /*
        * out sequence, rebuild gate_out_map
        */

        console.log('- gate_out_map out of sequence, rebuild -');
        gate_map_build('out').then(() => {
          console.log('- gate_out_map rebuild done -');
        });

        return;
      }

      console.log('== db_gate change, not stored in map.', change);
      return;

    }).on('error', (err) => {
      console.log(err);
    });
  };

  const cleanup = () => {
    console.log('- setInterval cleanup gate map -');

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

  gate_map_build().then(() => {
    listen_changes();
    cleanup();
  });

</script>
