import { db_reg } from '../db/db';

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
    console.log('db_reg.put', res);

    setTimeout(() => {
      flood_blocked = false;
    }, flood_block_time);

  }).catch((err) => {
    console.log('ERR db_reg.put', err);
  });
};

const reg_del = (reg) => {

  db_reg.remove(reg).then((res) => {
    console.log('== handle remove reg ==', res);
    selected_person_id.set(undefined);
  }).catch((err) => {
    console.log(err);
  });
};

export const reg_block_time = 3600000;
export { reg_add };
export { reg_del };
