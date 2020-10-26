const PouchDB = require('pouchdb').default;

// PouchDB.plugin(require('pouchdb-find'));
const db_prefix = 'ijspoort_';
const db_reg_i = new PouchDB(db_prefix + 'reg');
const db_reg = {};
const db_nfc = new PouchDB(db_prefix + 'nfc');
const db_eid = new PouchDB(db_prefix + 'eid');
const db_person = new PouchDB(db_prefix + 'person');
const db_person_search = new PouchDB(db_prefix + 'person_search');
const db_person_nfc_search = new PouchDB(db_prefix + 'person_nfc_search');
