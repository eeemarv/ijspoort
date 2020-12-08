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
const db_person_man_search = new PouchDB(db_prefix + 'person_man_search');
const db_person_eid_search = new PouchDB(db_prefix + 'person_eid_search');
const db_person_nfc_search = new PouchDB(db_prefix + 'person_nfc_search');

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

db_person.changes({
    since: 0,
    live: true,
    include_docs: true
}).on('change', function (change) {
    console.log('CHANGE');
    console.log(change);
    // change.id contains the doc id, change.doc contains the doc
    if (change.deleted) {
    // document was deleted
    } else {
      // document was added/modified
    }
}).on('error', function (err) {
    console.log('db_person.changes error');
    console.log(err);
});


export {
    shallow_compare,
    generate_id,
    db_reg,
    db_nfc,
    db_eid,
    db_person,
    db_person_man_search,
    db_person_eid_search,
    db_person_nfc_search
};