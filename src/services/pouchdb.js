const env = window.require('electron').remote.process.env;
import PouchDB from 'pouchdb';

if (!env.DB_PREFIX){
    throw 'env DB_PREFIX not set';
}
if (!env.DB_HOST){
    throw 'env DB_URL not set';
}
if (!env.DB_USERNAME){
    throw 'env DB_USERNAME not set';
}
if (!env.DB_PASSWORD){
    throw 'env DB_PASSWORD not set';
}

const db_host = env.DB_HOST;

const sync_options = {
    live: true,
    retry: true,
    continuous: true
};

const db_prefix = env.DB_PREFIX;
const i_reg = db_prefix + 'reg';
const i_nfc = db_prefix + 'nfc';
const i_eid = db_prefix + 'eid';
const i_person = db_prefix + 'person';

const db_reg = new PouchDB(i_reg);
const db_nfc = new PouchDB(i_nfc);
const db_eid = new PouchDB(i_eid);
const db_person = new PouchDB(i_person);

const db_remote_reg = new PouchDB('https://' + env.DB_PASSWORD + ':' + env.DB_USERNAME + '@' + db_host + '/' + i_reg);

db_reg.sync(db_remote_reg, sync_options)
.on('change', function (info) {
    console.log('CHANGE');
    console.log(info);
    // handle change
}).on('paused', function (err) {
    console.log('PAUSED');
    console.log(err);
    // replication paused (e.g. replication up to date, user went offline)
}).on('active', function () {
    console.log('ACTIVE');
    // replicate resumed (e.g. new changes replicating, user went back online)
}).on('denied', function (err) {
    console.log('DENIED');
    console.log(err);
    // a document failed to replicate (e.g. due to permissions)
}).on('complete', function (info) {
    console.log('COMPLETE');
    console.log(info);
    // handle complete
}).on('error', function (err) {
    console.log('UNHANDLED ERROR');
    console.log(err);
    // handle error
});


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
    db_person,
    env
};