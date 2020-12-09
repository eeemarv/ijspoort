//const PouchDB = require('pouchdb').default;
//import PouchDB from 'pouchdb';
// import * as PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';

// PouchDB.plugin(require('pouchdb-find'));
const db_prefix = 'ijspoort_';
const db_reg = new PouchDB(db_prefix + 'reg');
const db_nfc = new PouchDB(db_prefix + 'nfc');
const db_eid = new PouchDB(db_prefix + 'eid');
const db_person = new PouchDB(db_prefix + 'person');

/*
const db_person_eid_search = new PouchDB(db_prefix + 'person_eid_search');
const db_person_nfc_search = new PouchDB(db_prefix + 'person_nfc_search');
*/

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

const design_search_doc = {
    _id: '_design/search',
    views: {
        by_text: {
            map: search_text_map.toString()
        }
    }
};

const put_design_person_text_search = () => {
    db_person.put(design_search_doc).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log('Design doc already exists');
        console.log(err);
    });
};

const generate_id = () => {
    return Array(12).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
};

const shallow_compare = (a, b) => {
    const keys_a = Object.keys(a);
    const keys_b = Object.keys(a);
    if (keys_a.length !== keys_b.length){
        return false;
    }
    for (let k of keys_a) {
        if (a[k] !== b[k]) {
            return false;
        }
    }
    return true;
};

export {
    shallow_compare,
    put_design_person_text_search,
    generate_id,
    db_reg,
    db_nfc,
    db_eid,
    db_person
};