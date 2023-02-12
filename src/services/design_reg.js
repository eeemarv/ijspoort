import { db_reg } from './db';
import lodash from 'lodash';

const design_reg_search_doc = {
  _id: '_design/search',
  views: {
    count_by_person_id_and_ts_epoch: {
      map: ((doc) => {
        emit(doc.person_id + '_' + doc.ts_epoch.toString());
      }).toString(),
      reduce: '_count'
    },
    count_by_date: {
      map: ((doc) => {
        let ts_date = new Date(doc.ts_epoch);
        let year = ts_date.getFullYear().toString();
        let month = (ts_date.getMonth() + 1).toString().padStart(2, '0');
        let date = ts_date.getDate().toString().padStart(2, '0');
        emit(year + '-' + month + '-' + date);
      }).toString(),
      reduce: '_count'
    },
    count_per_hour: {
      map: ((doc) => {
        let ts_hour = Math.floor(doc.ts_epoch / 3600000) * 3600000;
        emit(ts_hour);
      }).toString(),
      reduce: '_count'
    }
  }
};

const put_design_reg_search = () => {
  db_reg.get(design_reg_search_doc._id).catch((err) => {
    if (err.name === 'not_found'){
      return 'put';
    }
    throw err;
  }).then((res) => {
    if (res === 'put'){
      return design_reg_search_doc;
    }
    let compare_design_doc = {...res};
    delete compare_design_doc._rev;
    if (lodash.isEqual(compare_design_doc, design_reg_search_doc)){
      throw 'no change for design_reg_search_doc';
    }
    design_reg_search_doc._rev = res._rev;
    return design_reg_search_doc;
  }).then((res) => {
    return db_reg.put(res);
  }).then((res) => {
    console.log('design_reg_search_doc updated');
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
};

export { put_design_reg_search };
