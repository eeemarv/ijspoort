import { db_nfc } from '../db/db';
import { nfc_id_to_uid } from '../nfc/nfc_id';
import { sub_nfc_map } from '../services/sub';
import { sub_gate_nfc_auto_block_enabled } from '../services/sub';
import { sub_person_map } from '../services/sub';
import { sub_person_nfc_map } from '../services/sub';

let flood_blocked = false;
const flood_block_time = 500;

/**
 * @param {string} person_id
 * @param {string} nfc_id
 * @returns {undefined}
 */
const nfc_add = (person_id, nfc_id) => {

  if (flood_blocked){
    console.log('flood blocked nfc_add');
    return;
  }
  flood_blocked = true;

  const nfc = {
    ts_epoch: (new Date()).getTime(),
    person_id: person_id,
    uid: nfc_id_to_uid(nfc_id),
    _id: nfc_id
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
 * @param {int} ts_epoch
 * @returns {Object} mixin for reg_add (can contain prop blocked_nfcs)
 */
const nfc_block_others = (nfc_id, ts_epoch) => {
  if (!sub_gate_nfc_auto_block_enabled){
    return {};
  }
  if (!sub_nfc_map.has(nfc_id)){
    return {};
  }
  if (!Number.isInteger(ts_epoch) || !ts_epoch){
    console.log('incorrect ts_epoch', ts_epoch);
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
  const blocked_nfcs = [];
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
    const block_hs = [];
    if (typeof bl_nfc.block_hs !== 'undefined'){
      for (const a of bl_nfc.block_hs){
        block_hs.push({...a});
      }
    }
    block_hs.push({
      blocked: true,
      ts_epoch,
      by_nfc_uid: nfc_id_to_uid(nfc_id),
    });
    nfcs_bulk.push({
      ...bl_nfc,
      blocked: true,
      block_hs
    });
    blocked_nfcs.push(nfc_id_to_uid(n_id));
  }
  if (blocked_nfcs.length === 0){
    return {};
  }
  console.log('-- blocked nfcs, nfcs_bulk:', nfcs_bulk);

  db_nfc.bulkDocs(nfcs_bulk).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });

  return {blocked_nfcs};
};

/**
 * not used
 * @param {string} nfc_id
 * @returns {undefined}
 */
const nfc_block_manually = (nfc_id) => {
  if (!sub_nfc_map.has(nfc_id)){
    return;
  }
  const bl_nfc = sub_nfc_map.get(nfc_id);
  const block_hs = [];
  if (typeof bl_nfc.block_hs !== 'undefined'){
    for (const a of bl_nfc.block_hs){
      block_hs.push({...a});
    }
  }
  block_hs.push({
    blocked: true,
    ts_epoch: (new Date()).getTime(),
    by_manual: true
  });
  const nfc = {
    ...bl_nfc,
    blocked: true,
    block_hs
  };
  db_nfc.put(nfc).then((res) => {
    console.log('nfc manually blocked', res);
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * @param {string} nfc_id
 * @returns {undefined}
 */
const nfc_deblock = (nfc_id) => {
  if (!sub_nfc_map.has(nfc_id)){
    console.log('nfc not found 0 ' + nfc_id);
    return;
  }
  const bl_nfc = {...sub_nfc_map.get(nfc_id)};
  if (typeof bl_nfc.blocked === 'undefined'){
    console.log('nfc was not blocked', bl_nfc);
    return;
  }
  delete bl_nfc.blocked;
  const block_hs = [];
  if (typeof bl_nfc.block_hs !== 'undefined'){
    for (const a of bl_nfc.block_hs){
      block_hs.push({...a});
    }
  }
  block_hs.push({
    blocked: false,
    ts_epoch: (new Date()).getTime()
  });
  const nfc = {
    ...bl_nfc,
    block_hs
  };
  db_nfc.put(nfc).then((res) => {
    console.log('nfc deblocked', res);
  }).catch((err) => {
    console.log(err);
  });
};

export { nfc_add };
export { nfc_del };
export { nfc_block_others };
export { nfc_block_manually };
export { nfc_deblock };
