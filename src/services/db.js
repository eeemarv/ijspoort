const env = window.require('electron').remote.process.env;
import PouchDB from 'pouchdb';
import { sync_monitor } from './store';

if (!env.DB_LOCAL_PREFIX){
    throw 'env DB_LOCAL_PREFIX not set';
}
if (!env.DB_REMOTE_PREFIX){
    throw 'env DB_LOCAL_PREFIX not set';
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

const db_local_prefix = env.DB_LOCAL_PREFIX;
const db_reg = new PouchDB(db_local_prefix + 'reg');
const db_nfc = new PouchDB(db_local_prefix + 'nfc');
const db_person = new PouchDB(db_local_prefix + 'person');
const db_gate = new PouchDB(db_local_prefix + 'gate');

const conn_prefix = env.DB_URL + '/' + env.DB_REMOTE_PREFIX;
const auth = {
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD
};

const db_remote_reg = new PouchDB(conn_prefix + 'reg', {auth: auth});
const db_remote_nfc = new PouchDB(conn_prefix + 'nfc', {auth: auth});
const db_remote_person = new PouchDB(conn_prefix + 'person', {auth: auth});
const db_remote_gate = new PouchDB(conn_prefix + 'gate', {auth: auth});

const sync_options = {
    live: true,
    retry: true,
    batch_size: 100,
    batch_limit: 1,
    checkpoint: false,
    filter: (doc) => {
        return !doc._id.startsWith('_design');
    }
};

db_reg.sync(db_remote_reg, sync_options)
.on('change', (info) => {
    console.log('CHANGE');
    console.log(info);
    sync_monitor.set_active();
}).on('paused', (err) => {
    console.log('PAUSED');
    console.log(err);
}).on('active', () => {
    console.log('ACTIVE');
    sync_monitor.set_active();
}).on('denied', (err) => {
    console.log('DENIED');
    console.log(err);
    sync_monitor.set_error();
}).on('complete', (info) => {
    console.log('COMPLETE');
    console.log(info);
}).on('error', (err) => {
    console.log('UNHANDLED ERROR');
    console.log(err);
    sync_monitor.set_error();
});

db_nfc.sync(db_remote_nfc, sync_options)
.on('change', (info) => {
    console.log('CHANGE');
    console.log(info);
    sync_monitor.set_active();
}).on('paused', (err) => {
    console.log('PAUSED');
    console.log(err);
}).on('active', () => {
    console.log('ACTIVE');
    sync_monitor.set_active();
}).on('denied', (err) => {
    console.log('DENIED');
    console.log(err);
    sync_monitor.set_error();
}).on('complete', (info) => {
    console.log('COMPLETE');
    console.log(info);
}).on('error', (err) => {
    console.log('UNHANDLED ERROR');
    console.log(err);
    sync_monitor.set_error();
});

db_person.sync(db_remote_person, sync_options)
.on('change', (info) => {
    console.log('CHANGE');
    console.log(info);
    sync_monitor.set_active();
}).on('paused', (err) => {
    console.log('PAUSED');
    console.log(err);
}).on('active', () => {
    console.log('ACTIVE');
    sync_monitor.set_active();
}).on('denied', (err) => {
    console.log('DENIED');
    console.log(err);
    sync_monitor.set_error();
}).on('complete', (info) => {
    console.log('COMPLETE');
    console.log(info);
}).on('error', (err) => {
    console.log('UNHANDLED ERROR');
    console.log(err);
    sync_monitor.set_error();
});

db_gate.sync(db_remote_gate, sync_options)
.on('change', (info) => {
    console.log('CHANGE');
    console.log(info);
    sync_monitor.set_active();
}).on('paused', (err) => {
    console.log('PAUSED');
    console.log(err);
}).on('active', () => {
    console.log('ACTIVE');
    sync_monitor.set_active();
}).on('denied', (err) => {
    console.log('DENIED');
    console.log(err);
    sync_monitor.set_error();
}).on('complete', (info) => {
    console.log('COMPLETE');
    console.log(info);
}).on('error', (err) => {
    console.log('UNHANDLED ERROR');
    console.log(err);
    sync_monitor.set_error();
});

export {
    db_remote_nfc,
    db_remote_reg,
    db_remote_person,
    db_remote_gate,
    db_reg,
    db_nfc,
    db_person,
    db_gate,
    env
};
