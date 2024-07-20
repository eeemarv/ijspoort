import { sub_person_last_reg_ts_map } from '../services/sub';
import { reg_valid_time } from '../db_put/reg_put';

/**
 * @param {string} person_id
 * @returns {boolean}
 */
const person_is_already_registered = (person_id) => {
  if (!sub_person_last_reg_ts_map.has(person_id)){
    return false;
  }
  const ts_last_reg = sub_person_last_reg_ts_map.get(person_id);
  const ts_now = (new Date()).getTime();
  return ts_last_reg > ts_now - reg_valid_time;
};

export { person_is_already_registered };