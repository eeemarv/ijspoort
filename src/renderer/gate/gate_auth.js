const env = window.require('electron').remote.process.env;
import { sub_person_map } from '../services/sub';
import { get_search_str } from '../services/functions';

const auth_ary = env.GATE_AUTH.split(',');

/**
 * @param {string} person_id 
 * @returns {boolean}
 */
const gate_auth = (person_id) => {
  if (typeof person_id !== 'string'){
    return false;
  }
  if (!sub_person_map.has(person_id)){
    return false;
  }
  const person = sub_person_map.get(person_id);
  const group_ary = (person.group ?? '').split(',');
  for (const p_auth of auth_ary){
    if (p_auth === ''){
      continue;
    }
    const auth = get_search_str(p_auth);
    if (auth === ''){
      continue;
    }
    if (person.member_id === auth){
      return true;
    }
    if (person._id === auth){
      return true;
    }
    for (const p_group of group_ary){
      if (p_group === ''){
        continue;
      }
      const group = get_search_str(p_group);
      if (group === ''){
        continue;
      }
      if (group === auth){
        return true;
      }
    }
  }
  return false;
}

export { gate_auth };