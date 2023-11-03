import { db_tag } from './db';

let flood_blocked = false;
const flood_block_time = 1000;

const tag_add = (type_id, person_id) => {

  if (flood_blocked){
    console.log('flood blocked tag_add');
    return;
  }
  flood_blocked = true;

  const ts_epoch = (new Date()).getTime();
  const id = 't' + type_id + '_' + person_id + '_' + ts_epoch.toString();
  const tag = {
    ts_epoch: ts_epoch,
    person_id: person_id,
    type_id: type_id,
    _id: id
  };

  db_tag.put(tag).then((res) => {
    console.log('db_tag.put');
    console.log(res);

    setTimeout(() => {
      flood_blocked = false;
    }, flood_block_time);

  }).catch((err) => {
    console.log('ERR db_tag.put');
    console.log(err);
  });
};

export { tag_add };
