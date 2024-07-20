import { sub_person_map } from '../services/sub';
import { sub_member_person_map } from '../services/sub';

/**
 * @param {string|undefined} person_id
 * @param {string|undefined} member_period
 * @returns {boolean}
 */
const person_is_member = (person_id, member_period) => {
  if (typeof person_id !== 'string'){
    return false;
  }
  if (typeof member_period !== 'string'){
    return false;
  }
  if (member_period === '^'){
    return false;
  }
  if (!sub_member_person_map.has(member_period)){
    return false;
  }
  if (!sub_member_person_map.get(member_period).has(person_id)){
    return false;
  }
  return true;
};

export { person_is_member };
