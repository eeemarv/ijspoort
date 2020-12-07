import { db_person, db_person_man_search } from './pouchdb';

const update_index = (id_person, person) => {
    let search_surname = person.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    let search_nickname = person.nickname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    let search_firstnames = person.firstnames.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    let search_address = person.address_street_and_number.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    let search_email = person.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    let search_email_work = person.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');

    let by_nickname = {
        "_id": search_nickname + search_surname + '_' + person_id,
        "person_id": person_id,
        "type": "nickname"
    };
    let by_firstnames = {
        "_id": search_firstnames + search_surname + '_' + person_id,
        "person_id": person_id,
        "type": "firstnames"
    };
    let by_surname = {
        "_id": searchsurname + search_firstnames + '_' + person_id,
        "person_id": person_id,
        "type": "surname"
    };
    let by_address = {
        "_id": search_address + '_' + person_id,
        "person_id": person_id,
        "type": "address"
    };
    let by_phone = {
        "_id": person.phone + '_' + person_id,
        "person_id": person_id,
        "type": "phone"
    };
    let by_phone_home = {
        "_id": person.phone + '_' + person_id,
        "person_id": person_id,
        "type": "phone_home"
    };
    let by_phone_work = {
        "_id": person.phone + '_' + person_id,
        "person_id": person_id,
        "type": "phone_work"
    };
    let by_birth_date = {
        "_id": person.birth_date + '_' + person_id,
        "person_id": person_id,
        "type": "birth_date"
    };
    let by_email = {
        "_id": search_email + '_' + person_id,
        "person_id": person_id,
        "type": "email"
    };

    db_person_man_search.put(by_firstnames);
    db_person_man_search.put(by_surname);
    if (person.address !== ''){
        db_person_man_search.put(by_address);
    }
    if (person.phone !== ''){
        db_person_man_search.put(by_phone);
    }
    if (person.birth_date !== ''){
        db_person_man_search.put(by_birth_date);
    }
    if (person.email !== ''){
        db_person_man_search.put(by_email);
    }

    console.log(person);
};

const fetch_man_search = (text, update) => {
    let search_text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    db_person_man_search.allDocs({
        startkey: search_text,
        endkey: search_text + '\uffff',
        limit: 15,
        include_docs: true
    }).then((result) => {
        let person_ids = {};
        result.rows.forEach((r) => {
            if (r.doc.type !== 'birth_date'){
                person_ids[r.doc.person_id] = r.doc.person_id;
            }
        });
        return person_ids;
    }).then((person_ids) => {
        return db_person.allDocs({
            keys: Object.values(person_ids),
            include_docs: true
        });
    }).then((persons) => {
        update(persons.rows);
    }).catch((err) => {
        console.log(err);
    });
};

export { update_index, fetch_man_search };