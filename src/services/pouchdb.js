//const PouchDB = require('pouchdb').default;
//import PouchDB from 'pouchdb';
// import * as PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';
import lodash from 'lodash';

// PouchDB.plugin(require('pouchdb-find'));
const db_prefix = 'ijspoort_';
const db_reg = new PouchDB(db_prefix + 'reg');
const db_nfc = new PouchDB(db_prefix + 'nfc');
const db_eid = new PouchDB(db_prefix + 'eid');
const db_person = new PouchDB(db_prefix + 'person');

function search_text_map(doc){
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

function count_members_2020(doc) {
    if (doc._id.startsWith('n0')){
        emit(true);
    }
};

function count_members_2021(doc) {
    if (doc._id.startsWith('n0')
        && !doc.open_balance.trim().startsWith('-')){
        emit(true);
    }
};

const design_person_search_doc = {
    _id: '_design/search',
    views: {
        by_text: {
            map: search_text_map.toString()
        },
        count_members_2020:{
            map: count_members_2020.toString(),
            reduce: '_count'
        },
        count_members_2021:{
            map: count_members_2021.toString(),
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
            throw 'no change for design_person_ssearch_doc';
        }
        design_person_search_doc._rev = res._rev;
        return design_person_search_doc;
    }).then((res) => {
        return db_person.put(res);
    }).then((res) => {
        console.log('design_person_search_doc_updated');
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
};

const generate_id = () => {
    return Array(12).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
};

export {
    put_design_person_search,
    generate_id,
    db_reg,
    db_nfc,
    db_eid,
    db_person
};