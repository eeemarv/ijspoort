import { db_nfc } from '../db/db';
import { nfc_map } from '../services/store';
import { person_nfc_map } from '../services/store';
import { sub_nfc_map } from '../services/sub';

let last_ts_epoch = undefined;

const nfc_map_build = async () => {
  return await db_nfc.allDocs({
    include_docs: true,
    startkey: 'uid_',
    endkey: 'uid_\uffff',
  }).then((res) => {
    console.log('build_nfc_maps NFC RES', res);

    const nfc_ary = res.rows ?? [];

    nfc_ary.sort((a, b) => {
      return a.doc.ts_epoch - b.doc.ts_epoch;
    });

    last_ts_epoch = undefined;

    nfc_map.update((m) => {
      m.clear();
      nfc_ary.forEach((v) => {
        const mx = {};
        if (typeof v.doc.block_hs !== 'undefined'){
          mx.block_hs = v.doc.block_hs.map((a) => {return {...a};});
        }
        m.set(v.id, {...v.doc, ...mx});
        last_ts_epoch = v.doc.ts_epoch;
      });
      return m;
    });

    person_nfc_map.update((m) => {
      m.clear();
      nfc_ary.forEach((v) => {
        if (!m.has(v.doc.person_id)){
          m.set(v.doc.person_id, new Set());
        }
        m.get(v.doc.person_id).add(v.id);
      });
      return m;
    });
  }).catch((err) => {
    console.log(err);
  });
};

const nfc_map_listen_changes = () => {
  console.log('-- listen changes nfc --');

  db_nfc.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change', (change) => {

    if (!change.id.startsWith('uid_')){
      return;
    }

    if (change.deleted){

      if (!sub_nfc_map.has(change.id)){
        console.log('== no change in nfc_map ', change);
        return;
      }

      const {person_id} = sub_nfc_map.get(change.id);

      nfc_map.update((m) => {
        m.delete(change.id);
        return m;
      });

      person_nfc_map.update((m) => {
        if (m.has(person_id)){
          m.get(person_id).delete(change.id);
          if (!m.get(person_id).size){
            m.delete(person_id);
          }
        }
        return m;
      });

      console.log('db_nfc.changes $nfc_map deleted ', change);

      return;
    }

    console.log('db_nfc.changes $nfc_map.set');
    console.log(change);

    /**
     * When block_hs is not undefined the
     * change is always an block or deblock update:
     * sequence order in nfc_map is then already correct
     * The revision for a new nfc_id could already be > 1
     * when it was previously deleted
     */
    const nfc_block_updated = typeof change.doc.block_hs !== 'undefined';
    console.log('nfc_block_updated: ', nfc_block_updated);

    if (typeof last_ts_epoch === 'undefined'
      || last_ts_epoch < change.ts_epoch
      || nfc_block_updated)
    {
      /**
      * add in sequence: add nfc to maps
      * or update block/deblock
      */
      nfc_map.update((m) => {
        const mx = {};
        if (typeof change.doc.block_hs !== 'undefined'){
          mx.block_hs = change.doc.block_hs.map((a) => {return {...a};});
        }
        m.set(change.id, {...change.doc, ...mx})
        last_ts_epoch = change.ts_epoch;
        return m;
      });

      if (!nfc_block_updated){
        person_nfc_map.update((m) => {
          if (!m.has(change.doc.person_id)){
            m.set(change.doc.person_id, new Set());
          }
          m.get(change.doc.person_id).add(change.id);
          return m;
        });
      }

      return;
    }

    console.log('gate_map out of sequence, rebuild');

    nfc_map_build().then(() => {
      console.log('gate_map rebuild done');
    });

    return;

  }).on('error', (err) => {
    console.log(err);
  });
};

export { nfc_map_build };
export { nfc_map_listen_changes };
