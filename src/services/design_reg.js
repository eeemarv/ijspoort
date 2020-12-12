import { db_reg } from './pouchdb';
import lodash from 'lodash';

function search_reg_member_id_map(doc) {
    emit(doc.member_id);
};
function search_reg_gate_keeper_id_map(doc){
    emit(doc.gate_keeper_id);
};
function find_reg_dates_since_30_days(doc){

};


const design_reg_search_doc = {
    _id: '_design/search',
    views: {
        by_member_id: {
            map: search_reg_member_id_map.toString()
        },
        by_gate_keeper_id: {
            map: search_reg_gate_keeper_id_map.toString()
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
