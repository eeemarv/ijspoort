import { db_tag } from './db';

const tag_add = (tag_type_id, person_id) => {
  let ts_epoch = (new Date()).getTime();
  let id = 't' + tag_type_id + '_' + person_id + '_' + ts_epoch.toString();
  let tag = {
    ts_epoch: ts_epoch,
    person_id: person_id,
    type_id: tag_type_id,
    _id: id
  };

  db_tag.put(tag).then((res) => {
    console.log('db_tag.put');
    console.log(res);
  }).catch((err) => {
    console.log('ERR db_tag.put');
    console.log(err);
  });
};

export { tag_add };
