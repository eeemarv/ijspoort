import { db_reg } from '../db/db';
import { sub_person_map } from '../services/sub';
import { get_date_str } from '../services/functions';
import { get_export_filename } from './export_functions';
import { get_iso_week } from './export_functions';
import { download } from '../services/download';
import Papa from 'papaparse';

/**
 * @param {number|undefined} ts_start
 * @param {number|undefined} ts_end
 * @param {string|undefined} member_period
 * @param {boolean} anonymize show names or not
 */
const person_reg_count_csv_export = (ts_start = undefined, ts_end = undefined, member_period = undefined, anonymize = false) => {

  const month_names = ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const weekpart_names = {
    "0.0": 'zo-mid',
    "0.1": 'zo-avo',
    "1.0": 'ma-mid',
    "1.1": 'ma-avo',
    "2.0": 'di-mid',
    "2.1": 'di-avo',
    "3.0": 'wo-mid',
    "3.1": 'wo-avo',
    "4.0": 'do-mid',
    "4.1": 'do-avo',
    "5.0": 'vr-mid',
    "5.1": 'vr-avo',
    "6.0": 'za-mid',
    "6.1": 'za-avo'
  };

  const person_reg_count_map = new Map();
  const month_set = new Set();
  const weekpart_set = new Set();

  const exp = {
    fields: ['lidnr'],
    data: []
  };

  if (!anonymize){
    exp.fields.push('Naam');
  }

  exp.fields.push('***');
  exp.fields.push('Totaal');
  exp.fields.push('***');

  console.log('CLICKED person_reg_count');

  db_reg.allDocs({
    startkey: ts_start ? 't' + ts_start : 't',
    endkey: ts_end ? 't' + ts_end : 't\uffff',
    include_docs: true
  }).then((res) => {
    res.rows.forEach((v) => {
      if (typeof v.doc.invalid !== 'undefined'){
        return;
      }

      if (typeof v.doc.person_id === 'undefined'){
        return;
      }

      if (!sub_person_map.has(v.doc.person_id)){
        return;
      }

      const person = sub_person_map.get(v.doc.person_id);

      if (typeof member_period !== 'undefined'){
        if (typeof person.member_in === 'undefined'
          || !(person.member_in instanceof Array)
          || person.member_in.length === 0){
          return;
        }

        if (!person.member_in.includes(member_period)){
          return;
        }
      }

      const ts_datetime = new Date(v.doc.ts_epoch);
      const hour = ts_datetime.getHours();
      const day = ts_datetime.getDay();
      const month = ts_datetime.getMonth();
      const day_suffix = '.' + (hour < 15 ? '0' : '1');
      const weekpart = day + day_suffix;

      month_set.add(month);
      weekpart_set.add(weekpart);

      if (!person_reg_count_map.has(v.doc.person_id)){
        person_reg_count_map.set(v.doc.person_id, new Map());
      }

      const count_map = person_reg_count_map.get(v.doc.person_id);

      if (!count_map.has('total')){
        count_map.set('total', 0);
      }

      count_map.set('total', count_map.get('total') + 1);

      if (!count_map.has(month)){
        count_map.set(month, 0);
      }

      count_map.set(month, count_map.get(month) + 1);

      if (!count_map.has(weekpart)){
        count_map.set(weekpart, 0);
      }

      count_map.set(weekpart, count_map.get(weekpart) + 1);
    });

    const month_ary = [...month_set].sort((a, b) => a - b);

    for (const month of month_ary){
      exp.fields.push(month_names[month]);
    }

    exp.fields.push('***');

    const weekpart_ary = [...weekpart_set].sort();

    for (const weekpart of weekpart_ary){
      exp.fields.push(weekpart_names[weekpart]);
    }

    for (const [person_id, person] of sub_person_map){

      if (typeof member_period !== 'undefined'){
        if (typeof person.member_in === 'undefined'
          || !(person.member_in instanceof Array)
          || person.member_in.length === 0){
          continue;
        }

        if (!person.member_in.includes(member_period)){
          continue;
        }
      }

      const count_map = person_reg_count_map.get(person_id) ?? new Map([['total', 0]]);
      const d = [];

      d.push(person.member_id);

      if (!anonymize){
        let name = person.firstname + ' ' ?? '*** ';
        name += person.nickname ? '(' + person.nickname + ') ' : '';
        name += person.surname ?? '***';
        d.push(name);
      }

      d.push('***');
      d.push(count_map.get('total'));
      d.push('***');

      for (const month of month_ary){
        if (count_map.has(month)){
          d.push(count_map.get(month));
          continue;
        }
        d.push('');
      }

      d.push('***');

      for (const weekpart of weekpart_ary){
        if (count_map.has(weekpart)){
          d.push(count_map.get(weekpart));
          continue;
        }
        d.push('');
      }

      exp.data.push(d);
    }

    return Papa.unparse(exp);
  }).then((csv) => {
    const file_id = 'reg_verdeling_' + Math.random().toString(36).substr(2, 5);
    download(csv,
      get_export_filename(file_id, 'csv'),
      'text/csv'
    );
  }).catch((err) => {
    console.log('ERR');
    console.log(err);
  });
};

export { person_reg_count_csv_export };
