/**
 * @param {string} str 
 * @returns {string}
 */

const get_search_str = (str) => {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
};

/**
 * @param {int} ts 
 * @returns {string}
 */
const get_time_str = (ts) => {
  const ts_date = new Date(ts);
  return ts_date.getHours().toString().padStart(2, '0') 
    + ':'
    + ts_date.getMinutes().toString().padStart(2, '0');
};

/**
 * @param {int} ts 
 * @returns {string}
 */
const get_date_str = (ts) => {
  return (new Date(ts)).toLocaleDateString('nl-BE', {weekday: 'short', month: 'short', year: 'numeric', day:'numeric'});
};

const get_random_str = (length = 12) => {
  const ch = 'abcdefghijklmnopqrstuvwxyz';
  let r = '';
  for (let i = 0; i < length; i++){
    r += ch.charAt(Math.floor(Math.random() * ch.length));
  }
  return r;
};

export { get_search_str };
export { get_time_str };
export { get_date_str };
export { get_random_str };