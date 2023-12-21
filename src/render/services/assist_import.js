import { db_person } from './db';
import lodash from 'lodash';
import { get_search_str } from './functions';
import { sub_person_map } from './sub';
import { build_person_idx } from './build_idx';

const XLSX = require('xlsx');

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
  adres: {
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

const assist_import = (file, assist_import_year) => {
  const year_key = 'y' + assist_import_year.substring(0);
  const workbook = XLSX.readFile(file);
  const sheet_name_list = workbook.SheetNames;
  const json_sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: '', raw: false});
  const persons_bulk = [];
  const active_yk_set = new Set();
  const year_start = parseInt(assist_import_year) - 5;
  const year_end = parseInt(assist_import_year) + 10;
  const import_map = new Map();

  for (let yy = year_start; yy < year_end; yy++){
    console.log('= = active yk y' + yy);
    active_yk_set.add('y' + yy);
  }

  json_sheet.forEach((a_per) => {
    const prsn = {
      member_year: {}
    };

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
          prsn.member_year[year_key] = true;
        }
      }
    });

    const full_name = prsn.firstname + ' ' + prsn.surname;

    if (!prsn.hasOwnProperty('member_id')){
      console.log('*** ERR import data, missing member_id for ' + full_name + ' ***');
      return;
    }

    const person_id = 'n' + prsn.member_id.padStart(8, '0');
    prsn._id = person_id;

    if (import_map.has(person_id)){
      const prev_prsn = import_map.get(person_id);
      const prev_full_name = prev_prsn.firstname + ' ' + prev_prsn.surname;
      console.log('*** ERR import data, duplicate person_id for ' + prev_full_name + ', ' + full_name);
      console.log('*** using ' +  full_name + ' ***');
    }

    import_map.set(person_id, {...prsn});
  });

  for (const [s_p_id, s_prsn] of sub_person_map){
    const {member_year: s_my, _rev: s_rev} = s_prsn;
    const sd_my = {...s_my};

    for (const yk in s_my){
      if (active_yk_set.has(yk)){
        continue;
      }
      // console.log('-- del yk: ' + s_p_id + ' > ' + yk);
      delete sd_my[yk];
    }

    if (import_map.has(s_p_id)){

      const prsn = import_map.get(s_p_id);

      if (prsn.member_year.hasOwnProperty(year_key)){
        sd_my[year_key] = true;
      } else {
        delete sd_my[year_key];
        if (Object.keys(sd_my).length === 0){
          persons_bulk.push({...s_prsn, _deleted: true});
          import_map.delete(s_p_id);        
          console.log('=-- del aa1, no sd_my ' + s_p_id);
          continue;
        }
      }

      const c_prsn = {...prsn, member_year: sd_my, _rev: s_rev};

      if (lodash.isEqual(c_prsn, s_prsn)){
        import_map.delete(s_p_id);
        // console.log('=== no change aa2 for ' + s_p_id);
        continue;
      }

      persons_bulk.push({...c_prsn});
      import_map.delete(s_p_id);
      console.log('=// update aa3 for ' + s_p_id);
      continue;
    }

    delete sd_my[year_key];

    if (Object.keys(sd_my).length === 0){
      persons_bulk.push({...s_prsn, _deleted: true});      
      console.log('=-- del aa4, not imported, no sd_my ' + s_p_id);
      continue;   
    }

    if (lodash.isEqual(sd_my, s_my)){
      // console.log('no change aa5 (not imported) ' + s_p_id);
      continue;     
    }

    persons_bulk.push({...s_prsn, member_year: sd_my});
    console.log('=// change my aa6 ' + s_p_id);
  }

  for (const [i_p_id, i_prsn] of import_map){
    if (i_prsn.member_year.hasOwnProperty(year_key)){
      console.log('=++ add aa7 ' + i_p_id);
      persons_bulk.push({...i_prsn});
      continue;   
    }

    // console.log('not add aa8 ' + i_p_id);
  }

  console.log('*** Assist import version 1.4 ***');

  if (persons_bulk.length === 0){
    console.log('== person: no bulkDocs operation, no change');
    return;
  }

  console.log('+++ persons_bulk +++', persons_bulk);

  db_person.bulkDocs(persons_bulk).then((res) => {
    console.log('++ person bulkDocs ready');
    console.log(res);

    build_person_idx();

  }).catch((err) => {
    console.log('!! person bulk error');
    console.log(err);
  });
};

export { assist_import };