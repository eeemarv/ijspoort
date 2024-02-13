/**
 * @param {string} reg_id
 * @returns {int}
 */
const reg_id_to_ts_epoch = (reg_id) => {
  return parseInt(reg_id.substring(1));
};

/**
 * @param {int} ts_epoch 
 * @returns {string}
 */
const ts_epoch_to_reg_id = (ts_epoch) => {
  return 't' + ts_epoch.toString();
};

export { reg_id_to_ts_epoch };
export { ts_epoch_to_reg_id };