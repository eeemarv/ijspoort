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

  const day_map = new Map();
  const hour_set = new Set();

  const exp = {
    fields: ['dag', 'registraties'],
    data: []
  };

  console.log('CLICKED (tot)');

  db_reg.allDocs({
    startkey: 't',
    endkey: 't\uffff',
    include_docs: true
  }).then((res) => {
    res.rows.forEach((v) => {
      if (typeof v.doc.invalid !== 'undefined'){
        return;
      }

      const ts_datetime = new Date(v.doc.ts_epoch);
      const hour = ts_datetime.getHours();

      if (typeof filter_weekday !== 'undefined'){

        if (filter_weekday !== ts_datetime.getDay()){
          return;
        }

        if (typeof filter_after_3pm !== 'undefined'){
          if (filter_after_3pm){
            if (hour < 15){
              return;
            }
          } else {
            if (hour > 14){
              return;
            }
          }
        }
      }

      const date_string = ts_datetime.toLocaleDateString('nl-BE', {weekday: 'short', month: 'short', year: 'numeric', day:'numeric'});

      if (!day_map.has(date_string)){
        day_map.set(date_string, new Map());
      }

      const hour_map = day_map.get(date_string);

      if (!hour_map.has(hour)){
        hour_map.set(hour, 0);
      }

      hour_map.set(hour, hour_map.get(hour) + 1);

      hour_set.add(hour);
    });

    const hour_ary = [...hour_set].sort((a, b) => a - b);

    for (const hour of hour_ary){
      exp.fields.push(hour + 'u');
    }

    for (const [date_string, hour_map] of day_map){
      const d = [];
      d.push(date_string);
      d.push([...hour_map].reduce((s, n) => s + n[1], 0));

      for (const hour of hour_ary){
        if (hour_map.has(hour)){
          d.push(hour_map.get(hour));
          continue;
        }
        d.push('');
      }
      exp.data.push(d);
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
