import { db_reg } from '../db/db';

/**
 *
 * @param {string} person_id
 * @param {boolean} valid_en
 * @param {boolean} invalid_en
 * @returns {number}
 */

const reg_get_count_by_person_id = async (person_id, valid_en = true, invalid_en = true) => {
  if (!valid_en && !invalid_en){
    return 0;
  }
  let key_suffix = '';
  if (valid_en !== invalid_en){
    if (valid_en){
      key_suffix = '.v';
    } else {
      key_suffix = '.i';
    }
  }
  return await db_reg.query('search/count_by_person_id', {
    key: person_id + key_suffix,
    reduce: true
  }).then((res) => {
    if (!res.rows.length){
      return 0;
    }
    return res.rows[0].value;
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * @param {string} person_id
 * @param {number} rows_per_page
 * @param {number} start_row
 * @param {boolean} valid_en
 * @param {boolean} invalid_en
 * @returns {Array}
 */
const reg_get_list_by_person_id = async (person_id, rows_per_page, start_row, valid_en = true, invalid_en = true) => {
  if (!valid_en && !invalid_en){
    return [];
  }
  let key_suffix = '';
  if (valid_en !== invalid_en){
    if (valid_en){
      key_suffix = '.v';
    } else {
      key_suffix = '.i';
    }
  }
  return await db_reg.query('search/count_by_person_id', {
    key: person_id + key_suffix,
    descending: true,
    include_docs: true,
    limit: rows_per_page,
    skip: start_row,
    reduce: false
  }).then((res) => {

    console.log('REG search/by_person (pag) ', res);

    let regs = [];

    res.rows.forEach((v) => {
      regs.push(v.doc);
    });

    return regs;

  }).catch((err) => {
    console.log(err);
  });
};

export { reg_get_count_by_person_id };
export { reg_get_list_by_person_id };