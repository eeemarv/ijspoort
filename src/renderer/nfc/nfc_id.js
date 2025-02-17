/**
 * @param {string} nfc_id 
 * @returns {string}
 */
const nfc_id_to_uid = (nfc_id) => {
  return nfc_id.substring(4);
};

/**
 * @param {string} nfc_uid 
 * @returns {string}
 */
const nfc_uid_to_id = (nfc_uid) => {
  return 'uid_' + nfc_uid;
};

export { nfc_id_to_uid };
export { nfc_uid_to_id };
