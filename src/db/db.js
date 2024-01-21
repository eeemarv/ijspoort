const env = window.require('electron').remote.process.env;
import PouchDB from 'pouchdb';

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

export {
  db_remote_reg,
  db_remote_nfc,
  db_remote_person,
  db_remote_gate,
  db_remote_tag,
  db_reg,
  db_nfc,
  db_person,
  db_gate,
  db_tag
};
