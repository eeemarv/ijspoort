import { db_person } from '../db/db';
import lodash from 'lodash';
import { get_search_str } from '../services/functions';
import { sub_member_person_map, sub_person_map } from '../services/sub';
import { person_build_idx_by_text } from '../db_idx/person_idx';
import { person_build_idx_by_simular } from '../db_idx/person_idx';
import { member_id_to_person_id } from '../person/person_id';

const assist_person_map = {
  lidnummer: {
    key: "member_id"
  },
  inschrijvingsdatum: {
    key: "member_since"
  },
  voornaam: {
    key: "firstname"
  },
  naam: {
    key: "surname"
  },
  roepnaam: {
    key: "nickname"
  },
  straat: { // Assist export changed adres to straat!
    key: "address"
  },
  postcode: {
    key: "address_zipcode"
  },
  gemeente: {
    key: "address_municipality"
  },
  land: {
    key: "country"
  },
  telefoonthuis: {
    key: "phone_home",
    process:  (v) => { return v.replace(/\D/g,''); }
  },
  telefoonwerk: {
    key: "phone_work",
    process:  (v) => { return v.replace(/\D/g,''); }
  },
  gsm: {
    key: "phone_mobile",
    process: (v) => { return v.replace(/\D/g,''); }
  },
  email: {
    key: "email",
    process: (v) => { return v.toLowerCase(); }
  },
  emailwerk: {
    key: "email_work",
    process: (v) => { return v.toLowerCase(); }
  },
  geboortedatum: {
    key: "date_of_birth"
  },
  geboorteplaats: {
    ignore: true, // not applicable
    key: "place_of_birth"
  },
  gender: {
    key: "gender",
    process: (v) => { return v.toLowerCase().replace('v', 'f'); }
  },
  rijksregisternummer: {
    ignore: true, // will be removed from Assist export
    key: "national_number"
  },
  meerinfo: {
    key: "info"
  },
  nationaliteit: {
    key: "nationality"
  },
  ploeg: {
    key: "team"
  },
  werkgroepen: {
    key: "group"
  }
};

/**
 *
 * @param {string} file
 * @param {string} member_period
 * @returns {undefined}
 */
const person_assist_import = (file, member_period) => {
  if (!member_period){
    console.log('- No member_period set error.');
    return;
  }

  if (typeof member_period !== 'string'){
    console.log('- member_period is not a string error.');
    return;
  }

  const json_sheet = window.bridge.getJsonFromXlsxFile(file);
  const persons_bulk = [];

  const import_map = new Map();
  const member_set = new Set();

  json_sheet.forEach((a_per) => {
    const prsn = {};
    let is_member = false;

    Object.keys(a_per).forEach((a_per_key) => {
      let norm_key = get_search_str(a_per_key);
      let a_val = a_per[a_per_key];

      if ((norm_key in assist_person_map) && !('ignore' in assist_person_map[norm_key])){
        if ('process' in assist_person_map[norm_key]){
          prsn[assist_person_map[norm_key].key] = assist_person_map[norm_key].process(a_val);
        } else {
          prsn[assist_person_map[norm_key].key] = a_val;
        }
      }

      if (norm_key === 'openstaandsaldo'){
        if (!a_val.trim().startsWith('-')){
          is_member = true;
        }
      }
    });

    const full_name = prsn.firstname + ' ' + prsn.surname;

    if (!prsn.hasOwnProperty('member_id')){
      console.log('*** ERR import data, missing member_id for ' + full_name + ' ***');
      return;
    }

    const person_id = member_id_to_person_id(prsn.member_id);
    prsn._id = person_id;

    if (import_map.has(person_id)){
      const prev_prsn = import_map.get(person_id);
      const prev_full_name = prev_prsn.firstname + ' ' + prev_prsn.surname;
      console.log('*** ERR import data, duplicate person_id for ' + prev_full_name + ', ' + full_name);
      console.log('*** using ' +  full_name + ' ***');
    }

    import_map.set(person_id, {...prsn});
    if (is_member){
      member_set.add(person_id);
    } else {
      // in case of duplicate person_id error
      member_set.delete(person_id);
    }
  });

  for (const [p_id, s_prsn] of sub_person_map){
    const {member_in:comp_member_in, _rev, ...comp_prsn} = s_prsn;
    const member_in_set = new Set(comp_member_in ?? []);

    if (!import_map.has(p_id)){
      if (member_in_set.has(member_period)){
        member_in_set.delete(member_period);
        const update_rec = {...comp_prsn, member_in:[...member_in_set].sort(), _rev};
        console.log('=-1 remove member_period: ' + p_id, update_rec);
        persons_bulk.push(update_rec);
      }
      continue;
    }

    const prsn = import_map.get(p_id);

    if (member_set.has(p_id)){
      member_in_set.add(member_period);
    } else {
      member_in_set.delete(member_period);
    }

    const member_in = [...member_in_set].sort();
    const update_rec = {...prsn, member_in, _rev};

    if (lodash.isEqual(member_in, comp_member_in) === false){
      console.log('=-2 update member_period: ' + p_id, update_rec);
      persons_bulk.push(update_rec);
      import_map.delete(p_id);
      continue;
    }

    if (lodash.isEqual(prsn, comp_prsn) === false){
      console.log('=-3 update person data: ' + p_id, update_rec);
      persons_bulk.push(update_rec);
      import_map.delete(p_id);
      continue;
    }

    console.log('=-4 no change for ' + p_id, update_rec);
    import_map.delete(p_id);
  }

  for (const [p_id, prsn] of import_map){
    if (!member_set.has(p_id)){
      console.log('=-5 no add (no membership) ' + p_id, prsn);
      continue;
    }

    const update_rec = {member_in:[member_period], ...prsn};
    console.log('=-6 add ' + p_id, update_rec);
    persons_bulk.push(update_rec);
  }

  console.log('*** Assist import version 1.5 ***');

  if (persons_bulk.length === 0){
    console.log('== person: no bulkDocs operation, no change');
    return;
  }

  console.log('+++ persons_bulk +++', persons_bulk);

  db_person.bulkDocs(persons_bulk).then((res) => {
    console.log('++ person bulkDocs ready', res);
    return person_build_idx_by_text();
  }).then(() => {
    return person_build_idx_by_simular();
  }).catch((err) => {
    console.log('!! person bulk error', err);
  });
};

const person_remove_member_period = (member_period) => {
  const persons_bulk = [];

  if (!member_period){
    console.log('member_period empty');
    return;
  }
  if (typeof member_period !== 'string'){
    console.log('member_period is not string');
    return;
  }
  if (!sub_member_person_map.has(member_period)){
    console.log('member_period not found');
  }

  for (const person_id of sub_member_person_map.get(member_period)){
    if (!sub_person_map.has(person_id)){
      console.log('person_id ' + person_id + ' not found in sub_person_map');
      continue;
    }
    const s_person = sub_person_map.get(person_id);
    const {member_in:comp_member_in, ...r_person} = s_person;
    const member_in_set = new Set(comp_member_in ?? []);
    member_in_set.delete(member_period);

    const member_in = [...member_in_set].sort();
    const update_rec = {...r_person, member_in};

    if (lodash.isEqual(member_in, comp_member_in) === false){
      console.log('=-1 delete member_period: ' + person_id, update_rec);
      persons_bulk.push(update_rec);
      continue;
    }

    console.log('=-2 no change for ' + person_id, update_rec);
  }

  if (persons_bulk.length === 0){
    console.log('RM == person: no bulkDocs operation, no change');
    return;
  }

  console.log('RM +++ persons_bulk +++', persons_bulk);

  db_person.bulkDocs(persons_bulk).then((res) => {
    console.log('RM ++ person bulkDocs ready', res);
    return person_build_idx_by_text();
  }).then(() => {
    return person_build_idx_by_simular();
  }).catch((err) => {
    console.log('RM !! person bulk error', err);
  });
};

const person_cleanup = () => {
  const persons_bulk = [];

  if (!sub_member_person_map.has('^')){
    console.log('no persons without membership');
    return;
  }

  for (const person_id of sub_member_person_map.get('^')){
    if (!sub_person_map.has(person_id)){
      console.log('person_id ' + person_id + ' not found');
      continue;
    }
    persons_bulk.push({...sub_person_map.get(person_id), _deleted: true});
  }

  if (persons_bulk.length === 0){
    console.log('RM == person: no bulkDocs operation, no change');
    return;
  }

  console.log('RM +++ persons_bulk +++', persons_bulk);

  db_person.bulkDocs(persons_bulk).then((res) => {
    console.log('RM ++ person bulkDocs ready', res);
    return person_build_idx_by_text();
  }).then(() => {
    return person_build_idx_by_simular();
  }).catch((err) => {
    console.log('RM !! person bulk error', err);
  });
};

export { person_assist_import };
export { person_remove_member_period };
export { person_cleanup };