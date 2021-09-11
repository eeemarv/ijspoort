import { db_gate } from './db';
import lodash from 'lodash';

const design_gate_search_doc = {
    _id: '_design/search',
    views: {
        count_by_nfc_and_ts_epoch: {
            map: ((doc) => {
                emit(doc.nfc_uid + '_' + doc.ts_epoch.toString());
            }).toString(),
            reduce: '_count'
        },
        count_by_type_and_ts_epoch: {
            map: ((doc) => {
                if (doc.in){
                    emit('in_' . doc.ts_epoch.toString());
                } else if (doc.out){
                    emit('out_' . doc.ts_epoch.toString());
                } else if (doc.count_enabled){
                    emit('count_enabled_' . doc.ts_epoch.toString());
                } else if (doc.nfc_enabled){
                    emit('nfc_enabled_' . doc.ts_epoch.toString());
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
