import PouchDB from 'pouchdb';

if (!window.bridge.getEnvDbPrefix() && !window.bridge.getEnvDbLocalPrefix()){
  throw 'env DB_LOCAL_PREFIX not set';
}

if (!window.bridge.getEnvDbPrefix() && !window.bridge.getEnvDbRemotePrefix()){
  throw 'env DB_REMOTE_PREFIX not set';
}

if (!window.bridge.getEnvDbUrl()){
  throw 'env DB_URL not set';
}

if (!window.bridge.getEnvDbUsername()){
  throw 'env DB_USERNAME not set';
}

if (!window.bridge.getEnvDbPassword()){
  throw 'env DB_PASSWORD not set';
}

const db_local_options = {
  auto_compaction: true
};

const db_local_prefix = window.bridge.getEnvDbPrefix() || window.bridge.getEnvDbLocalPrefix();
const db_remote_prefix = window.bridge.getEnvDbPrefix() || window.bridge.getEnvDbRemotePrefix();

console.log('DB local prefix: ' + db_local_prefix);
console.log('DB remote prefix: ' + db_remote_prefix);

const db_reg = new PouchDB(db_local_prefix + 'reg', db_local_options);
const db_nfc = new PouchDB(db_local_prefix + 'nfc', db_local_options);
const db_person = new PouchDB(db_local_prefix + 'person', db_local_options);
const db_gate = new PouchDB(db_local_prefix + 'gate', db_local_options);
const db_tag = new PouchDB(db_local_prefix + 'tag', db_local_options);

const conn_prefix = window.bridge.getEnvDbUrl() + '/' + db_remote_prefix;
const auth = {
  username: window.bridge.getEnvDbUsername(),
  password: window.bridge.getEnvDbPassword()
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
