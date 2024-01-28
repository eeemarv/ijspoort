import { db_nfc } from '../db/db';
import { sub_nfc_map } from '../services/sub';
import { sub_nfc_gate_auto_block_enabled } from '../services/sub';
import { sub_person_map } from '../services/sub';
import { sub_person_nfc_map } from '../services/sub';

let flood_blocked = false;
const flood_block_time = 500;

/**
 * @param {string} person_id 
 * @param {string} nfc_uid 
 * @returns {undefined}
 */
const nfc_add = (person_id, nfc_uid) => {

  if (flood_blocked){
    console.log('flood blocked nfc_add');
    return;
  }
  flood_blocked = true;

  const nfc = {
    ts_epoch: (new Date()).getTime(),
    person_id: person_id,
    uid: nfc_uid,
    _id: 'uid_' + nfc_uid
  };

  db_nfc.put(nfc).then((res) => {
    console.log('db_nfc.put', res);

    setTimeout(() => {
      flood_blocked = false;
    }, flood_block_time);

  }).catch((err) => {
    console.log('ERR db_nfc.put', err);

    setTimeout(() => {
      flood_blocked = false;
    }, flood_block_time * 10);
  });
};

/**
 * @param {string} nfc_id 
 * @returns {undefined} 
 */
const nfc_del = (nfc_id) => {
  if (!sub_nfc_map.has(nfc_id)){
    return;
  }

  db_nfc.remove(sub_nfc_map.get(nfc_id)).then((res) => {
    console.log('== handle remove nfc ==', res);
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * @param {string} nfc_id
 * @returns {Object} mixin for reg_add
 */
const nfc_block_others = (nfc_id) => {
  if (!sub_nfc_gate_auto_block_enabled){
    return {};
  }
  if (!sub_nfc_map.has(nfc_id)){
    return {};
  }
  const nfc = sub_nfc_map.get(nfc_id);
  if (!sub_person_map.has(nfc.person_id)){
    return {};
  }
  if (!sub_person_nfc_map.has(nfc.person_id)){
    return {};
  }
  const nfc_id_set = sub_person_nfc_map.get(nfc.person_id);
  if (nfc_id_set.size === 1){
    return {};
  }
  const nfcs_bulk = [];
  const blocked_nfc_uid_ary = [];
  for (const n_id of nfc_id_set){
    if (n_id === nfc_id){
      continue;
    }
    if (!sub_nfc_map.has(n_id)){
      continue;
    }
    const bl_nfc = sub_nfc_map.get(n_id);
    if (typeof bl_nfc.blocked !== 'undefined'){
      continue;
    }
    nfcs_bulk.push({...bl_nfc, 
      blocked: {
        ts_epoch: (new Date()).getTime(),
        by_nfc_uid: nfc_id.substring(4)
      }
    });
    blocked_nfc_uid_ary.push(n_id.substring(4));
  }
  if (blocked_nfc_uid_ary.length === 0){
    return {};
  }
  console.log('-- blocked nfcs, nfcs_bulk:', nfcs_bulk);

  db_nfc.bulkDocs(nfcs_bulk).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });

  return {blocked_nfc_uid_ary};
};

/**
 * @param {string} nfc_id 
 * @returns {undefined}
 */
const nfc_block_manually = (nfc_id) => {
  if (!sub_nfc_map.has(nfc_id)){
    return;
  }
  const bl_nfc = {...sub_nfc_map.get(nfc_id),
    blocked: {
      ts_epoch: (new Date()).getTime(),
      by_manual: true
    }
  };
  db_nfc.put(bl_nfc).then((res) => {
    console.log('nfc manually blocked', res);
  }).catch((err) => {
    console.log(err);
  });
};

export { nfc_add };
export { nfc_del };
export { nfc_block_others };
export { nfc_block_manually };
