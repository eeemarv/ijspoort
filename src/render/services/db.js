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

const db_local_options = {
  auto_compaction: true
};

const db_local_prefix = env.DB_LOCAL_PREFIX;
const db_reg = new PouchDB(db_local_prefix + 'reg', db_local_options);
const db_nfc = new PouchDB(db_local_prefix + 'nfc', db_local_options);
const db_person = new PouchDB(db_local_prefix + 'person', db_local_options);
const db_gate = new PouchDB(db_local_prefix + 'gate', db_local_options);
const db_tag = new PouchDB(db_local_prefix + 'tag', db_local_options);

const conn_prefix = env.DB_URL + '/' + env.DB_REMOTE_PREFIX;
const auth = {
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD
};

const db_remote_reg = new PouchDB(conn_prefix + 'reg', {auth: auth});
const db_remote_nfc = new PouchDB(conn_prefix + 'nfc', {auth: auth});
const db_remote_person = new PouchDB(conn_prefix + 'person', {auth: auth});
const db_remote_gate = new PouchDB(conn_prefix + 'gate', {auth: auth});
const db_remote_tag = new PouchDB(conn_prefix + 'tag', {auth: auth});

/**
 * sync
 */

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
  console.log('db_reg CHANGE');
  console.log(info);
  sync_monitor.set_active();
}).on('paused', () => {
  console.log('db_reg PAUSED');
}).on('active', () => {
  console.log('db_reg ACTIVE');
  sync_monitor.set_active();
}).on('denied', (err) => {
  console.log('db_reg DENIED');
  console.log(err);
  sync_monitor.set_error();
}).on('complete', (info) => {
  console.log('db_reg COMPLETE');
  console.log(info);
}).on('error', (err) => {
  console.log('db_reg ERROR');
  console.log(err);
  sync_monitor.set_error();
});

db_nfc.sync(db_remote_nfc, sync_options)
.on('change', (info) => {
  console.log('db_nfc CHANGE');
  console.log(info);
  sync_monitor.set_active();
}).on('paused', () => {
  console.log('db_nfc PAUSED');
}).on('active', () => {
  console.log('db_nfc ACTIVE');
  sync_monitor.set_active();
}).on('denied', (err) => {
  console.log('db_nfc DENIED');
  console.log(err);
  sync_monitor.set_error();
}).on('complete', (info) => {
  console.log('db_nfc COMPLETE');
  console.log(info);
}).on('error', (err) => {
  console.log('db_nfc ERROR');
  console.log(err);
  sync_monitor.set_error();
});

db_person.sync(db_remote_person, sync_options)
.on('change', (info) => {
  console.log('db_person CHANGE');
  console.log(info);
  sync_monitor.set_active();
}).on('paused', () => {
  console.log('db_person PAUSED');
}).on('active', () => {
  console.log('db_person ACTIVE');
  sync_monitor.set_active();
}).on('denied', (err) => {
  console.log('db_person DENIED');
  console.log(err);
  sync_monitor.set_error();
}).on('complete', (info) => {
    console.log('db_person COMPLETE');
    console.log(info);
}).on('error', (err) => {
  console.log('db_person ERROR');
  console.log(err);
  sync_monitor.set_error();
});

db_gate.sync(db_remote_gate, sync_options)
.on('change', (info) => {
  console.log('db_gate CHANGE');
  console.log(info);
  sync_monitor.set_active();
}).on('paused', () => {
  console.log('db_gate PAUSED');
}).on('active', () => {
  console.log('db_gate ACTIVE');
  sync_monitor.set_active();
}).on('denied', (err) => {
  console.log('db_gate DENIED');
  console.log(err);
  sync_monitor.set_error();
}).on('complete', (info) => {
  console.log('db_gate COMPLETE');
  console.log(info);
}).on('error', (err) => {
  console.log('db_gate ERROR');
  console.log(err);
  sync_monitor.set_error();
});

db_tag.sync(db_remote_tag, sync_options)
.on('change', (info) => {
  console.log('db_tag CHANGE');
  console.log(info);
  sync_monitor.set_active();
}).on('paused', () => {
  console.log('db_tag PAUSED');
}).on('active', () => {
  console.log('db_tag ACTIVE');
  sync_monitor.set_active();
}).on('denied', (err) => {
  console.log('db_tag DENIED');
  console.log(err);
  sync_monitor.set_error();
}).on('complete', (info) => {
  console.log('db_tag COMPLETE');
  console.log(info);
}).on('error', (err) => {
  console.log('db_tag ERROR');
  console.log(err);
  sync_monitor.set_error();
});

/**
 * call to remote db.info() to create the
 * remote dbs when they do not exist.
 */

db_remote_nfc.info().then((info) => {
  console.log(info);
}).catch((err) => {
  console.log(err);
});

db_remote_reg.info().then((info) => {
  console.log(info);
}).catch((err) => {
  console.log(err);
});

db_remote_person.info().then((info) => {
  console.log(info);
}).catch((err) => {
  console.log(err);
});

db_remote_gate.info().then((info) => {
  console.log(info);
}).catch((err) => {
  console.log(err);
});

db_remote_tag.info().then((info) => {
  console.log(info);
}).catch((err) => {
  console.log(err);
});

export {
  db_remote_reg,
  db_reg,
  db_nfc,
  db_person,
  db_gate,
  db_tag
};
