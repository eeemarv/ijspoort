import { db_person } from './pouchdb';
import lodash from 'lodash';

function search_person_text_map(doc){
    let firstname = doc.firstname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    let surname = doc.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    emit(firstname + surname);
    emit(surname + firstname);
    const ks = ['nickname', 'address', 'email', 'email_work', 'phone_mobile', 'phone_home', 'phone_work'];
    ks.forEach((k) => {
        if (doc[k]){
            emit(doc[k].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, ''));
        }
    });
};

function count_members_2020_map(doc) {
    if (doc._id.startsWith('n0')){
        emit(true);
    }
};

function count_members_2021_map(doc) {
    if (doc._id.startsWith('n0')
        && !doc.open_balance.trim().startsWith('-')){
        emit(true);
    }
};

const design_person_search_doc = {
    _id: '_design/search',
    views: {
        by_text: {
            map: search_person_text_map.toString()
        },
        count_members_2020:{
            map: count_members_2020_map.toString(),
            reduce: '_count'
        },
        count_members_2021:{
            map: count_members_2021_map.toString(),
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
