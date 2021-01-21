import { db_member } from './db';
import lodash from 'lodash';

const design_member_search_doc = {
    _id: '_design/search',
    views: {
        count_by_year: {
            map: ((doc) => {
                emit(doc.year);
            }).toString(),
            reduce: '_count'
        },
        count_by_person:{
            map: ((doc) => {
                emit(doc.person_id);
            }).toString(),
            reduce: '_count'
        }
    }
};

const put_design_member_search = () => {
    db_member.get(design_member_search_doc._id).catch((err) => {
        if (err.name === 'not_found'){
            return 'put';
        }
        throw err;
    }).then((res) => {
        if (res === 'put'){
            return design_member_search_doc;
        }
        let compare_design_doc = {...res};
        delete compare_design_doc._rev;
        if (lodash.isEqual(compare_design_doc, design_member_search_doc)){
            throw 'no change for design_member_search_doc';
        }
        design_member_search_doc._rev = res._rev;
        return design_member_search_doc;
    }).then((res) => {
        return db_member.put(res);
    }).then((res) => {
        console.log('design_member_search_doc updated');
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
};

export { put_design_member_search };
