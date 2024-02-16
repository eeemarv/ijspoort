const env = window.require('electron').remote.process.env;

const db_prefix = env.DB_PREFIX || env.DB_LOCAL_PREFIX;

/**
 * @returns {string}
 */

const get_export_time_str = () => {
  const ts = new Date();
  const date_str = ts.toLocaleDateString('nl-be', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}).replace(/ /g, '_');
  const time_str = ts.toLocaleTimeString('nl-be').replace(/:/g, '_');
  return date_str + '_' + time_str;
};

/**
 * @param {int} ts 
 * @returns {int}
 */
const get_iso_week = (ts) => {
  var ts_dt = new Date(ts);
  var day_n = (ts_dt.getDay() + 6) % 7;
  ts_dt.setDate(ts_dt.getDate() - day_n + 3);
  var first_thursday = ts_dt.getTime();
  ts_dt.setMonth(0, 1);
  if (ts_dt.getDay() !== 4) {
    ts_dt.setMonth(0, 1 + ((4 - ts_dt.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((first_thursday - ts_dt.getTime()) / 604800000);
};

/**
 * @param {string} id 
 * @param {string} extension 
 * @returns {string}
 */
const get_export_filename = (id, extension) => {
  return db_prefix + id + '_' + get_export_time_str() + '.' + extension;
};

export { get_export_time_str };
export { get_export_filename };
export { get_iso_week };