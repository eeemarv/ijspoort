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

const generate_id = () => {
    return Array(12).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
};

export {
    generate_id,
    db_reg,
    db_nfc,
    db_eid,
    db_person
};