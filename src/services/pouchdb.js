const env = window.require('electron').remote.process.env;
import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-authentication'));

if (!env.DB_PREFIX){
    throw 'env DB_PREFIX not set';
}
if (!env.DB_URL){
    throw 'env DB_URL not set';
}
if (!env.DB_USERNAME){
    throw 'env DB_USERNAME not set';
}
if (!env.DB_PASSWORD){
    throw 'env DB_PASSWORD not set';
}

const db_url = env.DB_URL;
const db_password = env.DB_PASSWORD;
const db_username = env.DB_USERNAME;
const db_remote_sync_enabled = env.DB_REMOTE_SYNC_ENABLED === '1' ? true : false;

const sync_options = {
    live: true,
    retry: true
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

if (db_remote_sync_enabled){
    const db_remote_reg = new PouchDB(db_url + i_reg, {skip_setup: true});
    db_remote_reg.login(db_username, db_password).then(() => {
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
    }).catch((err) => {
        console.log(err);
    });

    const db_remote_nfc = new PouchDB(db_url + i_nfc, {skip_setup: true});
    db_remote_nfc.login(db_username, db_password).then(() => {
        db_nfc.sync(db_remote_nfc, sync_options)
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
    }).catch((err) => {
        console.log(err);
    });

    const db_remote_person = new PouchDB(db_url + i_person, {skip_setup: true});
    db_remote_person.login(db_username, db_password).then(() => {
        db_person.sync(db_remote_person, sync_options)
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
    }).catch((err) => {
        console.log(err);
    });
}

export {
    db_reg,
    db_nfc,
    db_eid,
    db_person,
    env
};