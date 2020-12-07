import { db_person, db_person_search } from './pouchdb';

const assist_map = {
    lidnummer: {
        key: "membership_id"
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
    telefoon_thuis: {
        key: "phone_home",
        process:  (v) => { v.replace(/\D/g,'') }
    },
    telefoon_werk: {
        key: "phone_work",
        process:  (v) => { v.replace(/\D/g,'') }
    },
    gsm: {
        key: "phone_mobile",
        process:  (v) => { v.replace(/\D/g,'') }
    },
    email: {
        key: "email",
        process: (v) => { v.toLowerCase() }
    },
    email_werk: {
        key: "email_work",
        process: (v) => { v.toLowerCase() }
    },
    geboortedatum: {
        key: "date_of_birth"
    },
    geboorteplaats: {
        key: "place_of_birth"
    },
    geslacht: {
        key: "gender",
        process: (v) => { v.toLowerCase().replace('v', 'f') }
    },
    rijksregisternummer: {
        ignore: true, // will be removed from Assist export
        key: "national_number"
    },
    meer_info: {
        key: "info"
    },
    nationaliteit: {
        key: "nationality"
    },
    ploeg: {
        key: "team"
    },
    functie_in_ploeg: {
        key: "team_rank"
    },
    werkgroepen: {
        key: "working_group"
    },
    functie_in_werkgroep: {
        key: "working_group_rank"
    },
    te_betalen_lidgeld: {
        key: "membership_fee_to_pay"
    },
    al_betaald_lidgeld: {
        key: "membership_fee_already_paid"
    },
    openstaand_saldo: {
        key: "to_be_paid"
    }
};

let progress = 0;

const importXlsxFile = (file) => {
    const workbook = XLSX.readFile(file);
    const sheet_name_list = workbook.SheetNames;
    const json_sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: '', raw: false});

    json_sheet.forEach((a_per) => {
        let new_person = {};
        Object.keys(a_per).foreach((a_per_key) => {
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

        new_person._id = 'n_' + new_person.membership_id.padStart(8, '0');

        db_person.get(person._id).then((fetch_person) => {
            if (Object.entries(fetch_person).sort().toString() !== Object.entries(new_person).sort().toString()){
                return fetch_person;
            }
        }).then((fetch_person) => {
            new_person._rev = fetch_person._rev;
            db_person.put(new_person).then(() => {
                // show update
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            if (err.name === 'not_found'){
                db_pseron.put(new_person).then(() => {

                    // log insert
                }).catch((err) => {
                    console.log(err);
                });
            }
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
    });

    console.log(json_sheet);
}



export {};