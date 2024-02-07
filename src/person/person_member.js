import { sub_person_map } from '../services/sub';
import { sub_focus_year } from '../services/sub';

/**
 * @param {string} person_id 
 * @param {int|string} year 
 * @returns {boolean}
 */
const person_is_member_in_year = (person_id, year) => {
  if (!sub_person_map.has(person_id)){
    return false;
  }
  const person = sub_person_map.get(person_id);
  if (typeof person.member_year !== 'object'){
    return false;
  }
  if (person.member_year['y' + year]){
    return true;
  }
  return false;
};

/**
 * @param {string} person_id 
 * @returns {boolean}
 */
const person_is_member_in_focus_year = (person_id) => {
  return person_is_member_in_year(person_id, sub_focus_year);
};

/**
 * @param {string} person_id 
 * @returns {boolean}
 */
const person_is_member_this_year = (person_id) => {
  const year = (new Date()).getFullYear();
  return person_is_member_in_year(person_id, year);
};

export { person_is_member_in_focus_year };
export { person_is_member_this_year };