import { db_tag } from '../db/db';
import { sub_person_tag_map, sub_tag_type_map } from '../services/sub';
import { sub_tag_map } from '../services/sub';
import { tag_types_enabled } from '../services/store'; 
import lodash from 'lodash';

let tag_add_flood_blocked = false;
const tag_add_flood_block_time = 1000;

let tag_type_put_flood_blocked = false;
const tag_type_put_flood_block_time = 1000;

/**
 * @param {Array} type_id_ary 
 * @param {string} person_id 
 * @returns {undefined}
 */
const tag_add_bulk = (type_id_ary, person_id) => {
  if (tag_add_flood_blocked){
    console.log('flood blocked tag_add');
    return;
  }
  tag_add_flood_blocked = true;

  const p_map = sub_person_tag_map.get(person_id) ?? new Map();
  const tags_bulk = [];

  for (const type_id of type_id_ary){
    if (!sub_tag_type_map.has(type_id)){
      continue;
    }
    const tag_type = sub_tag_type_map.get(type_id);
    if (p_map.has(type_id)){
      const tag_count = p_map.get(type_id).size;
      if (tag_type.max_per_person <= tag_count){
        continue;
      }
    }
    const ts_epoch = (new Date()).getTime();
    const id = 't' + type_id + '_' + person_id + '_' + ts_epoch.toString();
    tags_bulk.push({
      ts_epoch: ts_epoch,
      person_id: person_id,
      type_id: type_id,
      _id: id
    });
  }

  console.log('-- tags_bulk', tags_bulk);

  if (!tags_bulk.length){
    tag_add_flood_blocked = false;    
    return;
  }

  db_tag.bulkDocs(tags_bulk).then((res) => {
    console.log('db_tag.bulkDocs', res);

    setTimeout(() => {
      tag_add_flood_blocked = false;
    }, tag_add_flood_block_time);

  }).catch((err) => {
    console.log('ERR db_tag.put', err);
  });
};

/**
 * @param {Object} tag_type 
 * @returns {undefined}
 */
const tag_type_put = (tag_type) => {
  if (tag_type_put_flood_blocked){
    console.log('flood blocked tag_type_put');
    return;
  }
  tag_type_put_flood_blocked = true;

  if (typeof tag_type._id === 'string'){
    if (!sub_tag_type_map.has(tag_type._id)){
      console.log('// no update tag type, non existant id ' + tag_type._id);
      tag_type_put_flood_blocked = false;
      return;
    }
    const {_rev, ts_epoch, ...comp_tag_type} = sub_tag_type_map.get(tag_type._id);
    if (lodash.isEqual(tag_type, comp_tag_type)){
      console.log('** no update for tag type, no changes, type id: ' + tag_type._id);
      tag_type_put_flood_blocked = false;
      return;
    }
    tag_type._rev = _rev;
    tag_type.ts_epoch = ts_epoch ?? (new Date()).getTime();
  } else {
    tag_type.ts_epoch = (new Date()).getTime();
    tag_type._id = '--';
    while (tag_type._id.length !== 10){
      tag_type._id = '0_' + Math.random().toString(36).substring(2, 10);
    }
  }

  db_tag.put(tag_type).then((res) => {
    console.log('-- db_tag.put tag type --');
    console.log(res);

    tag_types_enabled.update((t) => {
      t[tag_type._id] = true;
      return t;
    });

    setTimeout(() => {
      tag_type_put_flood_blocked = false;
    }, tag_type_put_flood_block_time);

  }).catch((err) => {
    console.log('ERR db_tag.put', err);
  });
};

/**
 * @param {string} type_id 
 * @returns {undefined}
 */
const tag_type_del = (type_id) => {
  if (sub_tag_map.has(type_id)
    && sub_tag_map.get(type_id).size > 0 
  ){
    console.log('== Can not delete tag type ' + type_id + ', tags exist');
    return;
  }

  db_tag.remove(sub_tag_type_map.get(type_id)).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * @param {Object} tag
 * @returns {undefined}
 */
const tag_del = (tag) => {
  db_tag.remove(tag).then((res) => {
    console.log('db_tag.remove', res);
  }).catch((err) => {
    console.log('db_tag.remove err', err);
  });
};

export { tag_add_bulk };
export { tag_del };
export { tag_type_put };
export { tag_type_del };
