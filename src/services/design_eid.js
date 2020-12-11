import { db_eid } from './pouchdb';
import lodash from 'lodash';

function search_eid_person_id_map(doc) {
    emit(doc.person_id);
};

function search_eid_gate_keeper_id_map(doc){
    emit(doc.gate_keeper_id);
}

function count_eid_total(doc) {
    if (doc._id.startsWith('c')){
        emit(true);
    }
};

const design_eid_search_doc = {
    _id: '_design/search',
    views: {
        by_person_id: {
            map: search_eid_person_id_map.toString()
        },
        by_gate_keeper_id: {
            map: search_eid_gate_keeper_id_map.toString()
        },
        count_total: {
            map: count_eid_total.toString(),
            reduce: '_count'
        }
    }
};

const put_design_eid_search = () => {
    db_eid.get(design_eid_search_doc._id).catch((err) => {
        if (err.name === 'not_found'){
            return 'put';
        }
        throw err;
    }).then((res) => {
        if (res === 'put'){
            return design_eid_search_doc;
        }
        let compare_design_doc = {...res};
        delete compare_design_doc._rev;
        if (lodash.isEqual(compare_design_doc, design_eid_search_doc)){
            throw 'no change for design_eid_search_doc';
        }
        design_eid_search_doc._rev = res._rev;
        return design_eid_search_doc;
    }).then((res) => {
        return db_eid.put(res);
    }).then((res) => {
        console.log('design_eid_search_doc updated');
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
};

export { put_design_eid_search };
