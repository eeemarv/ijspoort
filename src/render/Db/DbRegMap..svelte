<script>
  import { db_reg } from '../services/db';
  import { reg_map } from '../services/store';
  import { person_last_reg_ts_map } from '../services/store';

  const reg_period = 18000000; // view regs last 5 hours
  const cleanup_interval = 60000; // cleanup view regs every minute

  const listen_changes = () => {

    console.log('-- LISTEN CHANGES DB_REG --');

    db_reg.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {

      if (!change.id.startsWith('t'))
      {
        return;
      }

      if (change.deleted){

        reg_map.update((m) => {
          m.delete(change.id);
          return m;
        });

        console.log('== db_reg.changes delete ' + change.id);
        return;
      }

      const ts_start = (new Date()).getTime() - reg_period;

      if (change.doc.ts_epoch < ts_start){
        console.log('== db_reg.changes, reg to old, do not map', change);
        return;
      }

      reg_map.update((m) => {
        m.set(change.id, change.doc);
        return m;
      });

      person_last_reg_ts_map.update((m) => {
        m.set(change.doc.person_id, change.doc.ts_epoch);
        return m;
      })

      console.log('== db_reg.changes, set to $reg_map and $person_last_reg_ts_map');
      console.log(change);
      return;

    }).on('error', (err) => {
      console.log(err);
    });
  };

  const cleanup = () => {
    setInterval(() => {
      const ts_start = (new Date()).getTime() - reg_period;
      const delete_keys = [];

      for (const [k, v] of $reg_map){

        console.log('REG_MAP_CLEANUP _');
        console.log('K', k);
        console.log('V', v);

        if (v.ts_epoch > ts_start){
          break;
        }

        delete_keys.push(k);
      }

      if (delete_keys.length){

        reg_map.update((m) => {
          delete_keys.forEach((k) => {
            m.delete(k);
          });
          return m;
        });

        console.log('==$reg_map cleanup, ' + delete_keys.length + ' deleted ==');
      }
      /*
      else {
        console.log('==$reg_map cleanup, no deletes ==');
      }
      */

    }, cleanup_interval);
  };

  db_reg.allDocs({
    include_docs: true,
    startkey: 't' + ((new Date()).getTime() - reg_period)
  }).then((res) => {

    console.log('load $reg_map map t RES');
    console.log(res);

    if (res.rows !== undefined && res.rows.length){
      reg_map.update((m) => {
        res.rows.forEach((v) => {
          m.set(v.id, v.doc);
        });
        return m;
      });

      person_last_reg_ts_map.update((m) => {
        res.rows.forEach((v) => {
          m.set(v.doc.person_id, v.doc.ts_epoch);
        })
        return m;
      });
    }

    console.log('=====$reg_map====');
    console.log($reg_map);
    console.log('=====$person_last_reg_ts_map====');
    console.log($person_last_reg_ts_map);

    listen_changes();
    cleanup();

  }).catch((err) => {
    console.log(err);
  });

</script>
