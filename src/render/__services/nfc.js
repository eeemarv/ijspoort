import { db_nfc } from './db';

let flood_blocked = false;
const flood_block_time = 500;

const nfc_add = (person_id, nfc_uid) => {

  if (flood_blocked){
    console.log('flood blocked nfc_add');
    return;
  }
  flood_blocked = true;

  const nfc = {
    ts_epoch: (new Date()).getTime(),
    person_id: person_id,
    uid: nfc_uid,
    _id: 'uid_' + nfc_uid
  };

  db_nfc.put(nfc).then((res) => {
    console.log('db_nfc.put');
    console.log(res);

    setTimeout(() => {
      flood_blocked = false;
    }, flood_block_time);

  }).catch((err) => {
    console.log('ERR db_nfc.put');
    console.log(err);

    setTimeout(() => {
      flood_blocked = false;
    }, flood_block_time * 10);
  });
};

const nfc_del = (nfc) => {

  db_nfc.remove(nfc).then((res) => {
    console.log('== handle remove nfc ==');
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
};

export { nfc_add };
export { nfc_del };
