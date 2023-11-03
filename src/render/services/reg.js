import { db_reg } from './db';

let flood_blocked = false;
const flood_block_time = 200;

const reg_add = (person_id, nfc_uid) => {

  if (flood_blocked){
    console.log('flood blocked reg_add');
    return;
  }
  flood_blocked = true;

  const ts_epoch = (new Date()).getTime();
  const id = 't' + ts_epoch.toString();
  const reg = {
    ts_epoch: ts_epoch,
    person_id: person_id,
    _id: id
  };

  if (nfc_uid === undefined){
    reg.manual = true;
  } else {
    reg.nfc_uid = nfc_uid;
  }

  db_reg.put(reg).then((res) => {
    console.log('db_reg.put');
    console.log(res);

    setTimeout(() => {
      flood_blocked = false;
    }, flood_block_time);

  }).catch((err) => {
    console.log('ERR db_reg.put');
    console.log(err);
  });
};

const reg_del = (reg) => {

  db_reg.remove(reg).then((res) => {
    console('== handle remove reg ==');
    console.log(res);
    $selected_person_id = undefined;
  }).catch((err) => {
    console.log(err);
  });
};

const get_reg_count_by_person_id = (person_id) => {
  return db_reg.query('search/count_by_person_id', {
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

const get_reg_list_by_person_id = (person_id, rows_per_page, start_row) => {
  return db_reg.query('search/by_person_id_and_ts_epoch', {
    startkey: person_id + '_\uffff',
    endkey: person_id + '_',
    descending: true,
    include_docs: true,
    limit: rows_per_page,
    skip: start_row,
    reduce: false
  }).then((res) => {

    console.log('REG search/by_person_id_and_ts_epoch');
    console.log(res);

    let regs = [];

    res.rows.forEach((v) => {
      regs.push(v.doc);
    });

    return regs;

  }).catch((err) => {
    console.log(err);
  });
};

export { reg_add };
export { reg_del };
export { get_reg_count_by_person_id };
export { get_reg_list_by_person_id };