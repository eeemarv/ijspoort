import { db_person, db_person_man_search } from './pouchdb';
import { shallow_compare } from './pouchdb';

const XLSX = require('xlsx');

const assist_map = {
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
    },
    tebetalenlidgeld: {
        key: "membership_fee_to_pay"
    },
    albetaaldlidgeld: {
        key: "membership_fee_already_paid"
    },
    openstaandsaldo: {
        key: "to_be_paid"
    }
};

let progress = 0;

const xls_assist_import = (file) => {
    const workbook = XLSX.readFile(file);
    const sheet_name_list = workbook.SheetNames;
    const json_sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: '', raw: false});

    json_sheet.forEach((a_per) => {
        let new_person = {};
        Object.keys(a_per).forEach((a_per_key) => {
            let norm_key = a_per_key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
            if ((norm_key in assist_map) && !('ignore' in assist_map[norm_key])){
                let a_val = a_per[a_per_key];
                if ('process' in assist_map[norm_key]){
                    new_person[assist_map[norm_key].key] = assist_map[norm_key].process(a_val);
                } else {
                    new_person[assist_map[norm_key].key] = a_val;
                }
            }
        });

        new_person._id = 'n' + new_person.member_id.padStart(8, '0');

        let update_ids = [];

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
            if (shallow_compare(compare_person, new_person)){
                throw 'no_change for ' + res._id;
            }
            new_person._rev = res._id;
            return new_person;
        }).then((res) => {
            console.log('new updated', res);
            return db_person.put(res);
        }).catch((err) => {
            console.log(err);
        });



        /*

        then((updated_person) => {





        })


            if (fetch_person.ok === true){
                return db_person.get(res._id);
            }
            return res;
        }).then((fetch_person) => {
            let compare_person = { ...fetch_person};
            delete compare_person._rev;
            if (shallow_compare(compare_person, new_person)){
                throw 'no_change';
            }
            new_person._rev = fetch_person._rev;
            return db_person.put(new_person);
        }).catch((err) => {
            if (err === 'no_change'){
                console.log('no change for ' + new_parson._id);
                return;
            } else if (err.name === 'not_found'){
                return db_person.put(new_person);

                .then(() => {

                }).catch((err) => {
                    console.log(err);
                });
            } else {
                console.log(err);
                return;
            }
        }).then((val) => {

        });

        let search_surname = person.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let search_nickname = person.nickname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let search_firstnames = person.firstnames.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let search_address = person.address_street_and_number.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let search_email = person.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let search_email_work = person.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');

        let person_by_nickname = {
            "_id": search_nickname + search_surname + '_' + person_id,
            "person_id": person_id,
            "type": "nickname"
        };
        let person_by_firstnames = {
            "_id": search_firstnames + search_surname + '_' + person_id,
            "person_id": person_id,
            "type": "firstnames"
        };
        let person_by_surname = {
            "_id": searchsurname + search_firstnames + '_' + person_id,
            "person_id": person_id,
            "type": "surname"
        };
        let person_by_address = {
            "_id": search_address + '_' + person_id,
            "person_id": person_id,
            "type": "address"
        };
        let person_by_phone = {
            "_id": person.phone + '_' + person_id,
            "person_id": person_id,
            "type": "phone"
        };
        let person_by_phone_home = {
            "_id": person.phone + '_' + person_id,
            "person_id": person_id,
            "type": "phone_home"
        };
        let person_by_phone_work = {
            "_id": person.phone + '_' + person_id,
            "person_id": person_id,
            "type": "phone_work"
        };
        let person_by_birth_date = {
            "_id": person.birth_date + '_' + person_id,
            "person_id": person_id,
            "type": "birth_date"
        };
        let person_by_email = {
            "_id": search_email + '_' + person_id,
            "person_id": person_id,
            "type": "email"
        };

        db_person_search.put(person_by_first_name);
        db_person_search.put(person_by_name);
        if (person.address !== ''){
            db_person_search.put(person_by_address);
        }
        if (person.phone !== ''){
            db_person_search.put(person_by_phone);
        }
        if (person.birth_date !== ''){
            db_person_search.put(person_by_birth_date);
        }
        if (person.email !== ''){
            db_person_search.put(person_by_email);
        }

        console.log(person);
        */
    });

    // console.log(json_sheet);
}

export { xls_assist_import };