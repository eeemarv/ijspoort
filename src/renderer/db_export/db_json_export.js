import { db_reg } from '../db/db';
import { db_nfc } from '../db/db';
import { db_person } from '../db/db';
import { db_gate } from '../db/db';
import { db_tag } from '../db/db';
import { download } from '../services/download';
import { get_export_filename } from './export_functions';

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
    download(JSON.stringify(dbs),
      get_export_filename('db_all', 'json'),
      'application/json');
    open = false;
  }).catch((err) => {
    console.log(err);
  });
};

export { db_json_export };