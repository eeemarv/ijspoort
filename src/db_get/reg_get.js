import { db_reg } from '../db/db';

const reg_get_count_by_person_id = async (person_id) => {
  return await db_reg.query('search/count_by_person_id', {
    key: person_id,
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

const reg_get_list_by_person_id = async (person_id, rows_per_page, start_row) => {

  return await db_reg.query('search/count_by_person_id', {
    key: person_id,
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