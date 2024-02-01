import { db_gate } from '../db/db';
import { sub_nfc_map } from '../services/sub';
import { sub_gate_count_enabled } from '../services/sub';
import { sub_gate_count } from '../services/sub';

let flood_in_blocked = false;
let flood_out_blocked = false;
const flood_block_time = 200;

/**
 * local function
 * @returns {Object} {ts_epoch, _id}
 */
const get_new_gate_base = () => {
  const ts_epoch = (new Date()).getTime();
  return {
    ts_epoch: ts_epoch,
    _id: 'g' + ts_epoch.toString()
  };
};

/**
 * local function
 * @param {string} nfc_id 
 * @returns {Object} {person_id, nfc_uid}
 */
const get_from_nfc = (nfc_id) => {
  if (typeof nfc_id === 'undefined'){
    return {};
  }
  if (!sub_nfc_map.has(nfc_id)){
    return {};
  }
  const nfc = sub_nfc_map.get(nfc_id);
  return {
    person_id: nfc.person_id,
    nfc_uid: nfc.uid
  };
};

/**
 * local
 * @returns {Object} {count}
 */
const get_from_gate_count = () => {
  if (!sub_gate_count_enabled){
    return {};
  }
  return {
    count: sub_gate_count
  };
};

/**
 * @param {string} nfc_id 
 * @returns {undefined}
 */
const gate_in_add = (nfc_id) => {

  if (flood_in_blocked){
    console.log('flood_in_blocked gate_in_add');
    return;
  }
  flood_in_blocked = true;

  db_gate.put({
    ...get_new_gate_base(),
    ...get_from_nfc(nfc_id),
    ...get_from_gate_count(),
    in: true
  }).then((res) => {
    console.log('db_gate.put in', res);

    setTimeout(() => {
      flood_in_blocked = false;
    }, flood_block_time);

  }).catch((err) => {
    console.log('ERR db_reg.put in ', err);
  });
};

/**
 * @returns {undefined}
 */
const gate_out_add = () => {

  if (flood_out_blocked){
    console.log('flood_out_blocked gate_out_add');
    return;
  }
  flood_out_blocked = true;

  db_gate.put({
    ...get_new_gate_base(),
    ...get_from_gate_count(),
    out: true
  }).then((res) => {
    console.log('db_gate.put', res);

    setTimeout(() => {
      flood_out_blocked = false;
    }, flood_block_time);

  }).catch((err) => {
    console.log('ERR db_reg.put', err);
  });
};

export { gate_in_add };
export { gate_out_add };
