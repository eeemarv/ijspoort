import { db_reg } from '../db/db';
import { sub_nfc_map } from '../services/sub';
import { sub_person_last_reg_ts_map } from '../services/sub';
import { sub_person_map } from '../services/sub';
import { sub_reg_map } from '../services/sub';
import { nfc_block_others, nfc_block_others } from './nfc_put';

let flood_blocked = false;
const flood_block_time = 200;

/**
 * Local function to prevent double registrations
 * @returns {bool}
 */
const reg_blocked = () => {
  if (flood_blocked){
    console.log('flood blocked reg_add_*');
    return true;
  }
  flood_blocked = true;
  return false;
};

/**
 * local function
 * @param {Object} reg 
 * @returns {undefined}
 */
const reg_put = (reg) => {
  db_reg.put(reg).then((res) => {
    setTimeout(() => {
      flood_blocked = false;
    }, flood_block_time);
    console.log('db_reg.put', res);
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * local function
 * @returns {Object} {ts_epoch, _id}
 */
const get_new_reg_base = () => {
  const ts_epoch = (new Date()).getTime();
  return {
    ts_epoch: ts_epoch,
    _id: 't' + ts_epoch.toString()
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
 * @param {string} person_id 
 * @returns {undefined}
 */
const reg_add_by_desk_manual = (person_id) => {
  if (reg_blocked()){
    return;
  }
  if (!sub_person_map.has(person_id)){
    return;
  }
  reg_put({
    ...get_new_reg_base(),
    person_id,
    manual: true,
    desk: true
  });
};

/**
 * @param {string} nfc_id 
 * @returns {undefined}
 */
const reg_add_by_desk_auto = (nfc_id) => {
  if (reg_blocked()){
    return;
  }
  if (!sub_nfc_map.has(nfc_id)){
    return;
  }
  reg_put({
    ...get_new_reg_base(),
    ...get_from_nfc(nfc_id),
    desk: true  
  });
};

/**
 * @param {string} nfc_id 
 * @returns {undefined}
 */
const reg_add_by_gate = (nfc_id) => {
  if (reg_blocked()){
    return;
  }
  if (!sub_nfc_map.has(nfc_id)){
    return;
  }
  reg_put({
    ...get_new_reg_base(),
    ...get_from_nfc(nfc_id),
    ...nfc_block_others(nfc_id),
    gate: true
  });
};

const reg_update_nfc_blocks_already_registered = (nfc_id) => {
  if (!sub_nfc_map.has(nfc_id)){
    console.log('nfc not found');
    return;
  }
  const person_id = sub_nfc_map.get(nfc_id).person_id;
  if (!sub_person_last_reg_ts_map.has(person_id)){
    console.log('person last reg not found');
    return;
  }
  const reg_id = 't' + sub_person_last_reg_ts_map.get(person_id).toString();
  if (!sub_reg_map.has(reg_id)){
    console.log('reg not found');
    return;
  }
  const reg = sub_reg_map.get(reg_id);
  if (typeof reg === 'undefined'){
    return;
  }
  const nfc_block = nfc_block_others(nfc_id);
  if (typeof nfc_block.blocked_nfc_uid_ary === 'undefined'){
    console.log('no nfcs blocked');
    return;
  }
  if (typeof reg.blocked_nfc_uid_ary === 'undefined'){
    reg.blocked_nfc_uid_ary = [];
  }
  reg.blocked_nfc_uid_ary = [...reg.blocked_nfc_uid_ary, ...nfc_block.blocked_nfc_uid_ary];
  db_reg.put(reg).then((res) => {
    console.log('reg (already registered) - blocked nfc uids updated', res);
  }).catch((err) => {
    console.log(err);
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

export const reg_block_time = 3600000;
export { reg_add_by_desk_manual };
export { reg_add_by_desk_auto };
export { reg_add_by_gate };
export { reg_del };
export { reg_update_nfc_blocks_already_registered };
