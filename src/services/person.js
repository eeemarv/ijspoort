import { db_person, db_member } from './db';
import lodash from 'lodash';

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
    geslacht: {
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

const assist_member_map = {
    tebetalenlidgeld: {
        key: "membership_fee_to_pay"
    },
    albetaaldlidgeld: {
        key: "membership_fee_already_paid"
    },
    openstaandsaldo: {
        key: "open_balance"
    }
};

const xls_assist_import = (file, year) => {
    const workbook = XLSX.readFile(file);
    const sheet_name_list = workbook.SheetNames;
    const json_sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: '', raw: false});

    json_sheet.forEach((a_per) => {
        let person_id;
        let new_person = {};
        let remove_member = false;
        let add_member = false;
        Object.keys(a_per).forEach((a_per_key) => {
            let norm_key = a_per_key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
            let a_val = a_per[a_per_key];
            if ((norm_key in assist_person_map) && !('ignore' in assist_person_map[norm_key])){
                if ('process' in assist_person_map[norm_key]){
                    new_person[assist_person_map[norm_key].key] = assist_person_map[norm_key].process(a_val);
                } else {
                    new_person[assist_person_map[norm_key].key] = a_val;
                }
            }

            if (norm_key === 'openstaandsaldo'){
                if (a_val.trim().startsWith('-')){
                    remove_member = true;
                } else {
                    add_member = true;
                }
            }
        });

        person_id = 'n' + new_person.member_id.padStart(8, '0');
        new_person._id = person_id;

        db_person.get(new_person._id).catch((err) => {
            if (err.name == 'not_found'){
                return 'put';
            }
            throw err;
        }).then((res) => {
            if (res === 'put'){
                return new_person;
            }
            let compare_person = { ...res};
            delete compare_person._rev;
            if (lodash.isEqual(compare_person, new_person)){
                throw 'no_change for ' + res._id;
            }
            new_person._rev = res._rev;
            return new_person;
        }).then((res) => {
            return db_person.put(res);
        }).then((res) => {
            console.log('new updated', res);
        }).catch((err) => {
            console.log(err);
        });

        let new_member = {
            _id: year + '_' + person_id,
            person_id: person_id,
            year: year
        };

        db_member.get(new_member._id).catch((err) => {
            if (err.name == 'not_found' && add_member){
                return db_member.put(new_member);
            }
            throw err;
        }).then((res) => {
            if (remove_member){
                return db_member.remove(res);
            }
            return res;
        }).then((res) => {
            if (add_member){
                console.log('add member');
            }
            if (remove_member){
                console.log('remove member');
            }
            console.log('db_member ', res);
        }).catch((err) => {
            console.log(err);
        });

    });
};

export { xls_assist_import };