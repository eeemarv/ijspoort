import { db_person } from './db';
import { person_map } from './store';
import { get_search_str } from './functions';

let p_map = new Map();

person_map.subscribe((m) => {
  p_map = m;
});

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

const get_person_simular_search_map = (person_id) => {
  const res_map = new Map();
  const lang_keys = person_simular_lang_keys;

  if (!p_map.has(person_id)){
    return res_map;
  }
  const person = p_map.get(person_id);

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
        res_map.set('group.' + group, 'group.' + g);
      });
      return;
    }
    res_map.set(k, k + '.' + get_search_str(person[k]));
  });

  return res_map;
};

const get_person_count_by_simular = async (person_id) => {
  const search_map = get_person_simular_search_map(person_id);
  const res_map = new Map();

  return await db_person.query('search/count_by_simular', {
    keys: [...search_map.values()],
    reduce: true,
    group: true,
  }).then((res) => {

    console.log('get_person_count_by_simular keys', [...search_map.values()]);
    console.log('get_person_count_by_simular RES');
    console.log(res);

    res.rows.forEach((v) => {
      res_map.set(v.key, v.value);
    });

    return res_map;
  }).catch((err) => {
    console.log(err);
  });
};

const get_person_ids_by_simular = async (search_key) => {
  const res_ary = [];

  return await db_person.query('search/count_by_simular', {
    key: search_key,
    reduce: false,
  }).then((res) => {

    console.log('get_person_ids_by_simular key ', search_key);
    console.log('get_person_ids_by_simular RES');
    console.log(res);

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

export { person_simular_lang_keys };
export { get_person_count_by_simular };
export { get_person_ids_by_simular };