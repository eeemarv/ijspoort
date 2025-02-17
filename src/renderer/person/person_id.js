
/**
 * @param {string} person_id 
 * @returns {string}
 */
const person_id_to_member_id = (person_id) => {
  return parseInt(person_id.substring(1)).toString(); 
};

/**
 * @param {string} member_id 
 * @returns {string}
 */
const member_id_to_person_id = (member_id) => {
  return 'n' + member_id.padStart(8, '0');
};

export { person_id_to_member_id };
export { member_id_to_person_id };
