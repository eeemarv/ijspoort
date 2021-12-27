import { db_tag } from './db';
import lodash from 'lodash';

const design_tag_search_doc = {
  _id: '_design/search',
  views: {
    count_by_person_id_and_ts_epoch: {
      map: ((doc) => {
        if (doc.person_id){
          emit(doc.person_id + '_' + doc.ts_epoch.toString());
        }
      }).toString(),
      reduce: '_count'
    },
    count_total: {
      map: ((doc) => {
        if(doc._id.startsWith('n')){
          emit('tag');
        } else if (doc._id.startsWith('0_')){
          emit('type');
        }
      }).toString(),
      reduce: '_count'
    },
    count_by_ts_epoch: {
      map: ((doc) => {
        if (doc.out){
          emit(doc.ts_epoch);
        }
      }).toString(),
      reduce: '_count'
    }
  }
};

const put_design_tag_search = () => {
  db_tag.get(design_tag_search_doc._id).catch((err) => {
    if (err.name === 'not_found'){
      return 'put';
    }
    throw err;
  }).then((res) => {
    if (res === 'put'){
      return design_tag_search_doc;
    }
    let compare_design_doc = {...res};
    delete compare_design_doc._rev;
    if (lodash.isEqual(compare_design_doc, design_tag_search_doc)){
      throw 'no change for design_tag_search_doc';
    }
    design_tag_search_doc._rev = res._rev;
    return design_tag_search_doc;
  }).then((res) => {
    return db_tag.put(res);
  }).then((res) => {
    console.log('design_tag_search_doc updated');
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
};

export { put_design_tag_search };
