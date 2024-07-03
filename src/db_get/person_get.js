import { db_person } from '../db/db';
import { get_search_str } from '../services/functions';
import { sub_person_map } from '../services/sub';
import { sub_member_period_filter } from '../services/sub';
import { sub_member_period_filter_enabled } from '../services/sub';

const person_simular_lang_keys = {
  name: 'Gelijke naam',
  date_of_birth: 'Gelijke geboortedatum',
  phone_mobile: 'Gelijke GSM nummer',
  phone_home: 'Gelijke telefoon thuis',
  phone_work: 'Gelijke telefoon van het werk',
  email: 'Gelijk email adres',
  email_work: 'Gelijk email adres van het werk',
  address: 'Gelijk adres',
  group: 'Gelijke werkgroep',
};

const get_search_map = (person_id) => {
  const res_map = new Map();
  const lang_keys = person_simular_lang_keys;

  if (!sub_person_map.has(person_id)){
    return res_map;
  }
  const person = sub_person_map.get(person_id);

  const firstname = get_search_str(person.firstname);
  const surname = get_search_str(person.surname);
  res_map.set('name', 'name.' + firstname + surname);

  Object.keys(lang_keys).forEach((k) => {
    if (k === 'name'){
      return;
    }
    if (person[k] === undefined){
      return;
    }
    if (person[k] === ''){
      return;
    }
    if (k === 'group'){
      const group_ary = person.group.split(',');
      group_ary.forEach((g) => {
        const group = get_search_str(g);
        res_map.set('group.' + group, 'group.' + group);
      });
      return;
    }
    res_map.set(k, k + '.' + get_search_str(person[k]));
  });

  return res_map;
};

const person_get_count_by_simular = async (person_id) => {
  const search_map = get_search_map(person_id);
  const res_map = new Map();

  return await db_person.query('search/count_by_simular', {
    keys: [...search_map.values()],
    reduce: true,
    group: true,
  }).then((res) => {

    console.log('person_get_count_by_simular keys', [...search_map.values()]);
    console.log('person_get_count_by_simular RES', res);

    res.rows.forEach((v) => {
      res_map.set(v.key, v.value);
    });

    return res_map;
  }).catch((err) => {
    console.log(err);
  });
};

const person_get_ids_by_simular = async (search_key) => {
  const res_ary = [];

  return await db_person.query('search/count_by_simular', {
    key: search_key,
    reduce: false,
  }).then((res) => {

    console.log('person_get_ids_by_simular key ', search_key);
    console.log('get_person_get_ids_by_simular RES', res);

    if (!res.rows.length){
      return [];
    }

    res.rows.forEach((v) => {
      res_ary.push(v.id);
    });

    return res_ary;
  }).catch((err) => {
    console.log(err);
  });
};

const person_ids_to_func_by_text = (text, update_func) => {
  let search_text = get_search_str(text);

  if (search_text === ''){
    update_func([]);
    return;
  }

  if (sub_member_period_filter_enabled){
    if (typeof sub_member_period_filter !== 'string'){
      update_func([]);
      return;
    }
    search_text = sub_member_period_filter + '.' + search_text;
  }

  db_person.query('search/count_by_text', {
    startkey: search_text,
    endkey: search_text + '\uffff',
    limit: 20,
    include_docs: false,
    reduce: false
  }).then((res) => {

    console.log('MANUAL RES.', res);

    const person_id_set = new Set();

    res.rows.every((v) => {
      if (person_id_set.size > 10){
        return false;
      }
      person_id_set.add(v.id);
      return true;
    });

    update_func([...person_id_set]);

  }).catch((err) => {
    console.log(err);
  });
};

export { person_simular_lang_keys };
export { person_get_count_by_simular };
export { person_get_ids_by_simular };
export { person_ids_to_func_by_text };