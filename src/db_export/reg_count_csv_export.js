import { db_reg } from '../db/db';
import { get_date_str } from '../services/functions';
import { get_export_filename } from './export_functions';
import { get_iso_week } from './export_functions';
import { download } from '../services/download';
import Papa from 'papaparse';

/**
 * @param {number|undefined} filter_weekday
 * @param {boolean|undefined} filter_after_3pm
 */
const reg_hour_count_csv_export = (filter_weekday = undefined, filter_after_3pm = undefined) => {
  let reg_max = 0;
  let reg_count = 0;
  let ts_start_hour = 0;
  let ts_prev_hour = -10;
  let hour_count = 0;
  let next = false;

  const exp = {
    fields: ['dag', 'aanvang', 'aantal uren', 'registraties', 'max aantal reg./uur'],
    data: []
  };

  const push_hour_rec = () => {
    const d = [];
    d.push(get_date_str(ts_start_hour));
    d.push((new Date(ts_start_hour)).getHours().toString() + 'u');
    d.push(hour_count.toString());
    d.push(reg_count.toString());
    d.push(reg_max.toString());
    exp.data.push(d);
  };

  console.log('CLICKED (tot)');

  const reg_hour_map = new Map();

  db_reg.allDocs({
    startkey: 't',
    endkey: 't\uffff',
    include_docs: true
  }).then((res) => {
    res.rows.forEach((v) => {
      if (typeof v.doc.invalid !== 'undefined'){
        return;
      }
      if (typeof filter_weekday !== 'undefined'){
        const ts_datetime = new Date(v.doc.ts_epoch);
        if (filter_weekday !== ts_datetime.getDay()){
          return;
        }
        if (typeof filter_after_3pm !== 'undefined'){
          if (filter_after_3pm){
            if (ts_datetime.getHours() < 15){
              return;
            }
          } else {
            if (ts_datetime.getHours() > 14){
              return;
            }
          }
        }
      }
      const ts_hour = Math.floor(v.doc.ts_epoch / 3_600_000) * 3_600_000;
      if (reg_hour_map.has(ts_hour)){
        reg_hour_map.set(ts_hour, reg_hour_map.get(ts_hour) + 1);
        return;
      }
      reg_hour_map.set(ts_hour, 1);
    });

    for (const [ts_hour, r_count] of reg_hour_map){
      if (ts_hour > ts_prev_hour + 3_600_000){
        next = true;
      }
      if (next && hour_count && reg_count > 9){
        push_hour_rec();
      }
      if (next){
        ts_start_hour = ts_hour;
        reg_count = 0;
        reg_max = 0;
        hour_count = 0;
        next = false;
      }
      hour_count++;
      reg_count += r_count;
      reg_max = Math.max(reg_max, r_count);
      ts_prev_hour = ts_hour;
    }

    if (hour_count > 0 && reg_count > 9){
      push_hour_rec();
    }

    return Papa.unparse(exp);
  }).then((csv) => {
    let file_id = 'total';
    if (typeof filter_weekday !== 'undefined'){
      file_id = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'][filter_weekday];
      if (typeof filter_after_3pm !== 'undefined'){
        file_id += '_';
        file_id += filter_after_3pm ? 'avond' : 'ochtend';
      }
    }
    download(csv,
      get_export_filename('reg_' + file_id, 'csv'),
      'text/csv'
    );
  }).catch((err) => {
    console.log('ERR');
    console.log(err);
  });
};

const reg_week_count_csv_export = () => {
  const exp = {
    fields:['week', 'eerste dag', 'registraties'],
    data:[]
  };

  const reg_week_map = new Map();

  console.log('CLICKED (week)');

  db_reg.allDocs({
    startkey: 't',
    endkey: 't\uffff',
    include_docs: true
  }).then((res) => {
    console.log('RES', res);

    res.rows.forEach((v) => {
      if (typeof v.doc.invalid !== 'undefined'){
        return;
      }
      const ts_week = (Math.floor((v.doc.ts_epoch + 259_200_000) / 604_800_000) * 604_800_000) - 259_200_000;
      if (reg_week_map.has(ts_week)){
        reg_week_map.set(ts_week, reg_week_map.get(ts_week) + 1);
        return;
      }
      reg_week_map.set(ts_week, 1);
    });

    for (const [ts_week, r_count] of reg_week_map){
      const d = [];
      d.push(get_iso_week(ts_week));
      d.push(get_date_str(ts_week));
      d.push(r_count.toString());
      exp.data.push(d);
    }

    return Papa.unparse(exp);
  }).then((csv) => {
    download(csv,
      get_export_filename('reg_week', 'csv'),
      'text/csv'
    );
  }).catch((err) => {
    console.log('ERR');
    console.log(err);
  });
};

const reg_month_count_csv_export = () => {
  const exp = {
    fields:['maand', 'registraties'],
    data:[]
  };

  const reg_month_map = new Map();

  console.log('CLICKED (month)');

  db_reg.allDocs({
    startkey: 't',
    endkey: 't\uffff',
    include_docs: true
  }).then((res) => {
    console.log('RES', res);

    res.rows.forEach((v) => {
      if (typeof v.doc.invalid !== 'undefined'){
        return;
      }

      const dt = new Date(v.doc.ts_epoch);
      dt.setDate(1);
      dt.setHours(0, 0, 0, 0);
      const ts_month = dt.getTime();
      if (reg_month_map.has(ts_month)){
        reg_month_map.set(ts_month, reg_month_map.get(ts_month) + 1);
        return;
      }
      reg_month_map.set(ts_month, 1);
    });

    for (const [ts_month, r_count] of reg_month_map){
      const d = [];
      d.push((new Date(ts_month)).toLocaleDateString('nl-BE', {month: 'short', year: 'numeric'}));
      d.push(r_count.toString());
      exp.data.push(d);
    }

    return Papa.unparse(exp);
  }).then((csv) => {
    download(csv,
      get_export_filename('reg_month', 'csv'),
      'text/csv'
    );
  }).catch((err) => {
    console.log('ERR');
    console.log(err);
  });
};

export { reg_hour_count_csv_export };
export { reg_week_count_csv_export };
export { reg_month_count_csv_export };
