import { db_nfc } from './pouchdb';
import lodash from 'lodash';

function search_nfc_member_id_map(doc) {
    emit(doc.member_id);
};
function search_nfc_gate_keeper_id_map(doc){
    emit(doc.gate_keeper_id);
}
const design_nfc_search_doc = {
    _id: '_design/search',
    views: {
        by_member_id: {
            map: search_nfc_member_id_map.toString()
        },
        by_gate_keeper_id: {
            map: search_nfc_gate_keeper_id_map.toString()
        }
    }
};
const put_design_nfc_search = () => {
    db_nfc.get(design_nfc_search_doc._id).catch((err) => {
        if (err.name === 'not_found'){
            return 'put';
        }
        throw err;
    }).then((res) => {
        if (res === 'put'){
            return design_nfc_search_doc;
        }
        let compare_design_doc = {...res};
        delete compare_design_doc._rev;
        if (lodash.isEqual(compare_design_doc, design_nfc_search_doc)){
            throw 'no change for design_nfc_search_doc';
        }
        design_nfc_search_doc._rev = res._rev;
        return design_nfc_search_doc;
    }).then((res) => {
        return db_nfc.put(res);
    }).then((res) => {
        console.log('design_nfc_search_doc updated');
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
};

export { put_design_nfc_search };
