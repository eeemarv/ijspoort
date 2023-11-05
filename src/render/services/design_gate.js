import { db_gate } from './db';
import lodash from 'lodash';

const design_gate_search_doc = {
  _id: '_design/search',
  views: {

    /** rework to use _id */
    count_in_by_ts_epoch: {
      map: ((doc) => {
        if (doc.in){
          emit(doc.ts_epoch);
        }
      }).toString(),
      reduce: '_count'
    },

    /** rework to use _id */
    count_out_by_ts_epoch: {
      map: ((doc) => {
        if (doc.out){
          emit(doc.ts_epoch);
        }
      }).toString(),
      reduce: '_count'
    },

    /** rework to use _id */
    count_per_5_min: {
      map: ((doc) => {
        let ts_5_min = Math.floor(doc.ts_epoch / 300000) * 300000;
        if (doc.out){
          emit(ts_5_min.toString() + '_out');
        } else if (doc.in){
          emit(ts_5_min.toString() + '_in');
        }
      }).toString(),
      reduce: '_count'
    }
  }
};

const put_design_gate_search = () => {
  db_gate.get(design_gate_search_doc._id).catch((err) => {
    if (err.name === 'not_found'){
      return 'put';
    }
    throw err;
  }).then((res) => {
    if (res === 'put'){
      return design_gate_search_doc;
    }
    let compare_design_doc = {...res};
    delete compare_design_doc._rev;
    if (lodash.isEqual(compare_design_doc, design_gate_search_doc)){
      throw 'no change for design_gate_search_doc';
    }
    design_gate_search_doc._rev = res._rev;
    return design_gate_search_doc;
  }).then((res) => {
    return db_gate.put(res);
  }).then((res) => {
    console.log('design_gate_search_doc updated');
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
};

export { put_design_gate_search };
