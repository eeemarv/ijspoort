
/**
 * @param {string} type_id 
 * @param {string} person_id 
 * @param {int} ts_epoch 
 * @returns {string}
 */
const get_tag_id = (type_id, person_id, ts_epoch) => {
  return 't' + type_id + '_' + person_id + '_' + ts_epoch.toString();
};

/**
 * @param {string} tag_id 
 * @returns {object}
 */
const decompose_tag_id = (tag_id) => {
  const id_ary = change.id.substring(3).split('_');
  return {
    type_id: '0_' + id_ary[0],
    person_id: id_ary[1],
    ts_epoch: parseInt(id_ary[2])
  };
};

export { get_tag_id };
export { decompose_tag_id };
