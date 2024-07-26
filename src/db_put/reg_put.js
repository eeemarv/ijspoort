import { db_reg } from '../db/db';
import { sub_member_period_select } from '../services/sub';
import { sub_members_only_enabled } from '../services/sub';
import { sub_nfc_map } from '../services/sub';
import { sub_person_map } from '../services/sub';
import { sub_person_last_reg_ts_map } from '../services/sub';
import { sub_fresh_reg_ts_map } from '../services/sub';
import { ts_epoch_to_reg_id } from '../reg/reg_id';
import { ev_reg } from '../services/events';

let flood_blocked = false;
const flood_block_time = 200;
const reg_block_time = 30000;
const reg_valid_time = 18000000; // 5 hours

/**
 * Local function to prevent double registrations
 * @returns {bool}
 */
const reg_flood_blocked = () => {
  if (flood_blocked){
    console.log('flood blocked reg_add_*');
    return true;
  }
  setTimeout(() => {
    flood_blocked = false;
  }, flood_block_time);

  flood_blocked = true;
  return false;
};

/**
 * local function
 * @param {Object} reg
 * @returns {undefined}
 */
const reg_put = (reg) => {
  if (typeof reg._id === 'undefined'){
    console.log('no reg id error');
    return;
  }
  if (typeof reg.person_id === 'undefined'){
    console.log('no person_id error');
    return;
  }
  if (typeof reg.ts_epoch === 'undefined'){
    console.log('no ts_epoch error');
    return;
  }

  /** person registration too fresh gets blocked */
  if (sub_fresh_reg_ts_map.has(reg.person_id)){
    const ts_last_reg = sub_fresh_reg_ts_map.get(reg.person_id);
    console.log('+++ ts_last_reg', ts_last_reg);
    console.log('+++ reg.ts_epoch', reg.ts_epoch);
    if (reg.ts_epoch < (ts_last_reg + reg_block_time)){
      console.log('ev_reg too_fresh person_id ' + reg.person_id);
      ev_reg.dispatchEvent(new CustomEvent('too_fresh', {detail: {...reg}}));
      return;
    }
  }

  db_reg.put(reg).then((res) => {
    console.log('db_reg.put', res);

  }).catch((err) => {
    console.log(err);
  });
};

/**
 * local func
 * @param {int} ts_epoch
 * @returns {Object} {ts_epoch, _id}
 */
const get_new_reg_base = (ts_epoch) => {
  return {
    ts_epoch,
    _id: ts_epoch_to_reg_id(ts_epoch)
  };
};

/**
 * local function
 * @param {string} nfc_id
 * @returns {Object} {person_id, nfc_uid}
 */
const get_from_nfc = (nfc_id) => {
  const nfc = sub_nfc_map.get(nfc_id);
  return {
    person_id: nfc.person_id,
    nfc_uid: nfc.uid
  };
};

/**
 * @param {int} ts_epoch
 * @param {string|undefined} nfc_id use nfc_id (if possible) or person_id
 * @param {string|undefined} person_id
 * @returns {Object} invalid mixin
 */
const get_invalid = (ts_epoch, nfc_id, person_id) => {
  const invalid = {};
  let l_person_id;
  if (nfc_id){
    if (typeof nfc_id !== 'string'){
      invalid.error = 'type_nfc_id_not_string';
      console.log('invalid.error', invalid);
      return { invalid };
    }
    if (!nfc_id.startsWith('uid_')){
      invalid.error = 'nfc_id_wrong_format';
      console.log('invalid.error', invalid);
      return { invalid };
    }
    if (!sub_nfc_map.has(nfc_id)){
      invalid.error = 'nfc_id_not_mapped';
      console.log('invalid.error', invalid);
      return { invalid };
    }
    const nfc = sub_nfc_map.get(nfc_id);
    if (typeof nfc.person_id !== 'string'){
      invalid.error = 'no_person_id';
      console.log('invalid.error', invalid);
      return { invalid };
    }
    if (typeof nfc.blocked !== 'undefined'){
      invalid.blocked_nfc = true;
      console.log('invalid.blocked_nfc: true');
    }
    l_person_id = nfc.person_id;
  } else if (person_id){
    if (typeof person_id !== 'string'){
      invalid.error = 'type_person_id_not_string';
      console.log('invalid.error', invalid);
      return { invalid };
    }
    if (!person_id.startsWith('n')){
      invalid.error = 'person_id_wrong_format';
      console.log('invalid.error', invalid);
      return { invalid };
    }
    l_person_id = person_id;
  } else {
    invalid.error = 'no_nfc_id_or_person_id';
    console.log('invalid.error', invalid);
    return { invalid };
  }

  if (!sub_person_map.has(l_person_id)){
    invalid.error = 'person_id_not_mapped';
    console.log('invalid.error', invalid);
    return { invalid };
  }

  const person = sub_person_map.get(l_person_id);
  if (sub_members_only_enabled
    && sub_member_period_select
    && sub_member_period_select !== '^'
    && (typeof person.member_in === 'undefined'
      || !person.member_in.includes(sub_member_period_select))){

    invalid.not_member_in = sub_member_period_select;
    console.log('invalid.not_member_in: ' + sub_member_period_select);
  }

  if (sub_person_last_reg_ts_map.has(l_person_id)){
    const ts_last_reg = sub_person_last_reg_ts_map.get(l_person_id);
    if (ts_last_reg > (ts_epoch - reg_valid_time)){
      invalid.ts_recent = ts_last_reg;
      console.log('invalid.ts_recent: ' + ts_last_reg);
    }
  }

  if (Object.keys(invalid).length){
    return {invalid};
  }
  return {};
};

/**
 * @param {string} person_id
 * @param {int} ts_epoch
 * @returns {undefined}
 */
const reg_add_by_desk_manual = (person_id, ts_epoch) => {
  if (reg_flood_blocked()){
    return;
  }
  if (!sub_person_map.has(person_id)){
    return;
  }
  reg_put({
    ...get_new_reg_base(ts_epoch),
    ...get_invalid(ts_epoch, undefined, person_id),
    person_id,
    manual: true,
    desk: true,
  });
};

/**
 * @param {string} nfc_id
 * @returns {undefined}
 */
const reg_add_by_desk_nfc = (nfc_id, ts_epoch) => {
  if (reg_flood_blocked()){
    return;
  }
  if (!sub_nfc_map.has(nfc_id)){
    return;
  }
  reg_put({
    ...get_new_reg_base(ts_epoch),
    ...get_from_nfc(nfc_id),
    ...get_invalid(ts_epoch, nfc_id, undefined),
    desk: true
  });
};

/**
 * @param {string} nfc_id
 * @param {int} ts_epoch
 * @param {object} nfc_block_mixin result from nfc_block_others(), can contain property blocked_nfcs
 * @returns {undefined}
 */
const reg_add_by_gate_nfc = (nfc_id, ts_epoch, nfc_block_mixin = {}) => {
  if (reg_flood_blocked()){
    return;
  }
  if (!sub_nfc_map.has(nfc_id)){
    return;
  }
  reg_put({
    ...get_new_reg_base(ts_epoch),
    ...get_from_nfc(nfc_id),
    ...get_invalid(ts_epoch, nfc_id, undefined),
    ...nfc_block_mixin,
    gate: true
  });
};

/**
 * @param {Object} reg
 * @returns {undefined}
 */
const reg_del = (reg) => {
  db_reg.remove(reg).then((res) => {
    console.log('== handle remove reg ==', res);
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * to update older regs without invalid prop
 */
const reg_update_invalid_ts_recent = () => {
  db_reg.allDocs({
    include_docs: true
  }).then((res) => {
    console.log(res);
    const reg_bulk = [];
    const person_reg_map = new Map();
    for (const r of res.rows){
      if (typeof r.doc.ts_epoch === 'undefined'){
        console.log('ts_epoch undefined', r.doc);
        continue;
      }
      if (typeof r.doc.person_id === 'undefined'){
        console.log('person_id undefined', r.doc);
        continue;
      }
      if (typeof r.doc.invalid !== 'undefined'){
        console.log('== invalid ', r.doc);
        continue;
      }
      if (person_reg_map.has(r.doc.person_id)){
        const last_ts = person_reg_map.get(r.doc.person_id);
        if (r.doc.ts_epoch < (last_ts + reg_valid_time)){
          const invalid = {ts_recent: last_ts};
          reg_bulk.push({...r.doc, invalid});
          continue;
        }
      }
      person_reg_map.set(r.doc.person_id, r.doc.ts_epoch);
    }

    console.log('reg_bulk ', reg_bulk);

    if (reg_bulk.length === 0){
      throw 'reg_bulk empty';
    }

    return db_reg.bulkDocs(reg_bulk);
  }).then((res) => {
    console.log('reg_bulk...RES', res);
  }).catch((err) => {
    console.log(err);
  });
};

export { reg_block_time };
export { reg_valid_time };
export { reg_add_by_desk_manual };
export { reg_add_by_desk_nfc };
export { reg_add_by_gate_nfc };
export { reg_del };
// export { reg_update_invalid_ts_recent };
