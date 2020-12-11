//const PouchDB = require('pouchdb').default;
//import PouchDB from 'pouchdb';
// import * as PouchDB from 'pouchdb';
const env = window.require('electron').remote.process.env;
import PouchDB from 'pouchdb';

/*
const PouchDB = require('pouchdb');
const replicationStream = require('pouchdb-replication-stream');

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
*/
if (!env.DB_PREFIX){
    throw 'env db_prefix not set';
}

// PouchDB.plugin(require('pouchdb-find'));
/*
const db_url = electron.remote.process.env.DB_URL;
if (!db_url){
    throw 'no remote db_url configured';
}
*/

const db_prefix = env.DB_PREFIX;
const db_reg = new PouchDB(db_prefix + 'reg');
const db_nfc = new PouchDB(db_prefix + 'nfc');
const db_eid = new PouchDB(db_prefix + 'eid');
const db_person = new PouchDB(db_prefix + 'person');

/*
const db_remote_reg = new PouchDB(db_url + '/' + db_prefix + 'reg');
const db_remote_nfc = new PouchDB(db_url + '/' + db_prefix + 'nfc');
const db_remote_person = new PouchDB(db_url + '/' + db_prefix + 'person');
db_remote_reg.info().then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});
db_remote_nfc.info().then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});
db_remote_person.info().then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});
*/

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