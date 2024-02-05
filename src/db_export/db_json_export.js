const env = window.require('electron').remote.process.env;
import { db_reg } from '../db/db';
import { db_nfc } from '../db/db';
import { db_person } from '../db/db';
import { db_gate } from '../db/db';
import { db_tag } from '../db/db';
import { download } from '../services/download';

const db_local_prefix = env.DB_LOCAL_PREFIX;

const db_json_export = () => {
  const dbs = {};
  db_nfc.allDocs({
    include_docs: true
  }).then((res) => {
    dbs.db_nfc = res;
    return db_reg.allDocs({
      include_docs: true
    });
  }).then((res) => {
    dbs.db_reg = res;
    return db_person.allDocs({
      include_docs: true
    });
  }).then((res) => {
    dbs.db_person = res;
    return db_gate.allDocs({
      include_docs: true
    });
  }).then((res) => {
    dbs.db_gate = res;
    return db_tag.allDocs({
      include_docs: true
    });
  }).then((res) => {
    dbs.db_tag = res;
    return true;
  }).then(() => {
    const ts = new Date();
    const date_str = ts.toLocaleDateString('nl-be', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}).replace(/ /g, '_');
    const time_str = ts.toLocaleTimeString('nl-be').replace(/:/g, '_');
    download(JSON.stringify(dbs),
      'db_' + db_local_prefix + date_str + '_' + time_str + '.json',
      'application/json');
    open = false;
  }).catch((err) => {
    console.log(err);
  });
};

export { db_json_export };