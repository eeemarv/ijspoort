import { db_reg } from '../db/db';
import lodash from 'lodash';

const design_doc = {
  _id: '_design/search',
  views: {
    count_by_person_id: {
      map: ((doc) => {
        emit(doc.person_id);
      }).toString(),
      reduce: '_count'
    },
  }
};

const reg_put_design = async () => {
  return await db_reg.get(design_doc._id).catch((err) => {
    if (err.name === 'not_found'){
      return 'put';
    }
    throw err;
  }).then((res) => {
    if (res === 'put'){
      return design_doc;
    }
    let compare_design_doc = {...res};
    delete compare_design_doc._rev;
    if (lodash.isEqual(compare_design_doc, design_doc)){
      throw 'no change for reg design_doc';
    }
    design_doc._rev = res._rev;
    return design_doc;
  }).then((res) => {
    return db_reg.put(res);
  }).then((res) => {
    console.log('reg design_doc updated', res);
  }).catch((err) => {
    console.log(err);
  });
};

export { reg_put_design };
