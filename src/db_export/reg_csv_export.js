import { db_reg } from '../db/db';
import { get_date_str } from '../services/functions';
import { get_time_str } from '../services/functions';
import { sub_person_map } from '../services/sub';
import { get_export_filename } from './export_functions';
import Papa from 'papaparse';
import { download } from '../services/download';

const get_reg_csv_export_buttons = async (period_in_days) => {
  const ts_start = (new Date()).getTime() - (86400000 * period_in_days);
  const reg_day_count_map = new Map();
  return await db_reg.allDocs({
    startkey: 't' + ts_start.toString(),
    endkey: 't\uffff',
    include_docs: true
  }).then((res) => {
    res.rows.forEach((v) => {
      if (typeof v.doc.invalid !== 'undefined'){
        return;
      }
      const ts_day = Math.floor(v.doc.ts_epoch / 86_400_000) * 86_400_000;
      if (reg_day_count_map.has(ts_day)){
        reg_day_count_map.set(ts_day, reg_day_count_map.get(ts_day) + 1);
        return;
      }
      reg_day_count_map.set(ts_day, 1);
    });

    console.log('reg_day_count_map', reg_day_count_map);

    const cols = [[], [], []];
    const col_size = Math.ceil(reg_day_count_map.size / cols.length);
    let index = 0;
    for (const [ts_day, reg_count] of reg_day_count_map){
      const n_col = Math.floor(index / col_size);
      cols[n_col].push({ts_day, reg_count});
      index++;
    }

    return cols;
  });
};

const reg_csv_export = (ts_day) => {
  const exp = {
    fields:['tijdstip (' + get_date_str(ts_day) + ')', 'lidnummer', 'naam', 'tel', 'e-mail'],
    data:[]
  };
  db_reg.allDocs({
    startkey: 't' + ts_day.toString(),
    endkey: 't' + (ts_day + 86_400_000).toString(),
    include_docs: true
  }).then((res) => {
    res.rows.forEach((v) => {
      if (typeof v.doc.invalid !== 'undefined'){
        return;
      }
      const person = sub_person_map.get(v.doc.person_id);
      const d = [];
      d.push(get_time_str(v.doc.ts_epoch));
      d.push(person.member_id);
      d.push(person.firstname + ' ' + person.surname);
      d.push((person.phone_mobile || person.phone_home || person.phone_work || '').toString());
      d.push(person.email || person.email_work || '');
      exp.data.push(d);
    });
    return Papa.unparse(exp, {
      quotes: true
    });
  }).then((csv) => {
    const date_str = (new Date(ts_day)).toLocaleDateString('nl-be', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}).replace(/ /g, '_');
    download(csv,
      get_export_filename('reg__' + date_str + '__aaa', 'csv'),
      'text/csv'
    );
  }).catch((err) => {
    console.log(err);
  });
};

export { get_reg_csv_export_buttons };
export { reg_csv_export };
