/**
 * @param {string} reg_id
 * @returns {int}
 */
const gate_id_to_ts_epoch = (reg_id) => {
  return parseInt(reg_id.substring(1));
};

/**
 * @param {int} ts_epoch 
 * @returns {string}
 */
const ts_epoch_to_gate_id = (ts_epoch) => {
  return 'g' + ts_epoch.toString();
};

export { gate_id_to_ts_epoch };
export { ts_epoch_to_gate_id };