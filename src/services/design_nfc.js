import { db_nfc } from './db';
import lodash from 'lodash';

const design_nfc_search_doc = {
    _id: '_design/search',
    views: {
        count_by_person_id: {
            map: ((doc) => {
                emit(doc.person_id);
            }).toString(),
            reduce: '_count'
        },
        count_total: {
            map: ((doc) => {
                if(doc._id.startsWith('uid_')){
                    emit(true);
                }
            }).toString(),
            reduce: '_count'
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
