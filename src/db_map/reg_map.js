import { db_reg } from '../db/db';
import { reg_map } from '../services/store';
import { person_last_reg_ts_map } from '../services/store';
import { sub_reg_map } from '../services/sub';
import { sub_person_last_reg_ts_map } from '../services/sub';

const reg_period = 18000000; // view regs last 5 hours
const cleanup_interval = 60000; // cleanup view regs every minute

let last_ts_epoch = undefined;

const reg_map_build = async () => {

  return await db_reg.allDocs({
    include_docs: true,
    startkey: 't' + ((new Date()).getTime() - reg_period)
  }).then((res) => {

    console.log('load $reg_map map t RES', res);

    const reg_ary = res.rows ?? [];

    last_ts_epoch = undefined;

    reg_map.update((m) => {
      m.clear();
      reg_ary.forEach((v) => {
        if (typeof v.doc.blocked_nfc_uid_ary === 'undefined'){
          m.set(v.id, {...v.doc});
        } else {
          const blocked_nfc_uid_ary = [...v.doc.blocked_nfc_uid_ary];
          m.set(v.id, {...v.doc, blocked_nfc_uid_ary});
        }
        last_ts_epoch = v.doc.ts_epoch;
      });
      return m;
    });

    person_last_reg_ts_map.update((m) => {
      m.clear();
      reg_ary.forEach((v) => {
        m.set(v.doc.person_id, v.doc.ts_epoch);
      });
      return m;
    });

    console.log('=====sub_reg_map====', sub_reg_map);
    console.log('=====sub_person_last_reg_ts_map====', sub_person_last_reg_ts_map);

  }).catch((err) => {
    console.log(err);
  });
};

const reg_map_listen_changes = () => {
  console.log('- listen changes reg map');

  db_reg.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change', (change) => {

    if (!change.id.startsWith('t')){
      return;
    }

    console.log('-- db reg changes ', change);

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
      console.log('== db_reg.changes, reg too old, do not map', change);
      return;
    }

    if (typeof last_ts_epoch === 'undefined' 
      || last_ts_epoch < change.doc.ts_epoch){
      /*
      * in sequence, just add to map
      */
      person_last_reg_ts_map.update((m) => {
        m.set(change.doc.person_id, change.doc.ts_epoch);
        return m;
      });

      reg_map.update((m) => {
        if (typeof change.doc.blocked_nfc_uid_ary === 'undefined'){
          m.set(change.id, {...change.doc});
        } else {
          const blocked_nfc_uid_ary = [...change.doc.blocked_nfc_uid_ary];
          m.set(change.id, {...change.doc, blocked_nfc_uid_ary});
        }

        last_ts_epoch = change.doc.ts_epoch;
        return m;
      });

      return;
    }

    /*
    * out of sequence, refetch map
    */
    console.log('-reg map out of sequence, rebuild -');
    reg_map_build().then(() => {
      console.log('-reg map rebuild done-');
    });

    return;
  }).on('error', (err) => {
    console.log(err);
  });
};

const reg_map_cleanup = () => {
  console.log('- setInterval reg map cleanup -');

  setInterval(() => {
    const ts_start = (new Date()).getTime() - reg_period;
    const delete_keys = [];

    for (const [k, v] of sub_reg_map){

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

  }, cleanup_interval);
};

export { reg_period };
export { reg_map_build };
export { reg_map_listen_changes };
export { reg_map_cleanup };
