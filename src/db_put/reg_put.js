import { db_reg } from '../db/db';
import { sub_nfc_map } from '../services/sub';
import { sub_person_map } from '../services/sub';
import { ts_epoch_to_reg_id } from '../reg/reg_id';

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
 * @param {string} person_id
 * @param {int} ts_epoch
 * @returns {undefined}
 */
const reg_add_by_desk_manual = (person_id, ts_epoch) => {
  if (reg_blocked()){
    return;
  }
  if (!sub_person_map.has(person_id)){
    return;
  }
  reg_put({
    ...get_new_reg_base(ts_epoch),
    person_id,
    manual: true,
    desk: true
  });
};

/**
 * @param {string} nfc_id 
 * @returns {undefined}
 */
const reg_add_by_desk_auto = (nfc_id, ts_epoch) => {
  if (reg_blocked()){
    return;
  }
  if (!sub_nfc_map.has(nfc_id)){
    return;
  }
  reg_put({
    ...get_new_reg_base(ts_epoch),
    ...get_from_nfc(nfc_id),
    desk: true  
  });
};

/**
 * @param {string} nfc_id
 * @param {int} ts_epoch
 * @param {object} nfc_block_mixin result from nfc_block_others(), can contain property blocked_nfcs
 * @returns {undefined}
 */
const reg_add_by_gate = (nfc_id, ts_epoch, nfc_block_mixin = {}) => {
  if (reg_blocked()){
    return;
  }
  if (!sub_nfc_map.has(nfc_id)){
    return;
  }
  reg_put({
    ...get_new_reg_base(ts_epoch),
    ...get_from_nfc(nfc_id),
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

export const reg_block_time = 3600000;
export { reg_add_by_desk_manual };
export { reg_add_by_desk_auto };
export { reg_add_by_gate };
export { reg_del };
