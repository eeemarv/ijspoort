import { db_person } from './db';
import lodash from 'lodash';

const design_person_search_doc = {
    _id: '_design/search',
    views: {
        count_by_text: {
            map: ((doc) => {
                let firstname = doc.firstname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
                let surname = doc.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
                emit(firstname + surname);
                emit(surname + firstname);
                const ks = ['member_id', 'nickname', 'address', 'email', 'email_work', 'phone_mobile', 'phone_home', 'phone_work'];
                ks.forEach((k) => {
                    if (doc[k]){
                        emit(doc[k].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, ''));
                    }
                });
            }).toString(),
            reduce: '_count'
        },
        count_by_member_year: {
            map: ((doc) => {
                if (doc.member_year !== undefined)
                {
                    Object.keys(doc.member_year).forEach((yk) => {
                        emit(yk.substring(1));
                    });
                }
            }).toString(),
            reduce: '_count'
        }
    }
};

const put_design_person_search = () => {
    db_person.get(design_person_search_doc._id).catch((err) => {
        if (err.name === 'not_found'){
            return 'put';
        }
        throw err;
    }).then((res) => {
        if (res === 'put'){
            return design_person_search_doc;
        }
        let compare_design_doc = {...res};
        delete compare_design_doc._rev;
        if (lodash.isEqual(compare_design_doc, design_person_search_doc)){
            throw 'no change for design_person_search_doc';
        }
        design_person_search_doc._rev = res._rev;
        return design_person_search_doc;
    }).then((res) => {
        return db_person.put(res);
    }).then((res) => {
        console.log('design_person_search_doc updated');
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
};

export { put_design_person_search };
