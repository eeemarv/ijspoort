import './bootstrap.css';
import './index.css';

import { ipcRenderer, remote } from 'electron';
import fs from 'fs';
import XLSX from 'xlsx';
import autocomplete from 'autocompleter';

import settings from 'electron-settings';

let csv_map = '';

const eid_months = {
    "jan": 1,
    "feb": 2,
    "fev": 3,
    "mar": 4,
    "mrt": 5,
    "apr": 4,
    "avr": 4,
    "mei": 5,
    "mai": 5,
    "jun": 6,
    "jui": 6,
    "jul": 7,
    "aug": 8,
    "sep": 9,
    "okt": 10,
    "oct": 10,
    "nov": 11,
    "dec": 12
};

var nfc_uid_to_reg = '';

const PouchDB = require('pouchdb').default;
PouchDB.plugin(require('pouchdb-find'));
const db_prefix = 'ijspoort_';
const db_reg = new PouchDB(db_prefix + 'reg');
const db_nfc = new PouchDB(db_prefix + 'nfc');
const db_eid = new PouchDB(db_prefix + 'eid');
const db_person = new PouchDB(db_prefix + 'person');
const db_person_search = new PouchDB(db_prefix + 'person_search');
const db_person_nfc_search = new PouchDB(db_prefix + 'person_nfc_search');

const el_eid_reader = document.getElementById('eid_reader');
const el_eid = document.getElementById('eid');
const el_eid_national_number = document.getElementById('eid_national_number');
const el_eid_first_names = document.getElementById('eid_first_names');
const el_eid_name = document.getElementById('eid_name');
const el_nfc_reader = document.getElementById('nfc_reader');
const el_nfc = document.getElementById('nfc');
const el_nfc_uid = document.getElementById('nfc_uid');
const el_manual = document.getElementById('manual');
const el_btn_import = document.getElementById('btn_import');
const el_btn_map = document.getElementById('btn_map');
const el_btn_add_nfc = document.getElementById('btn_add_nfc');

const importXlsxFile = () => {
	const files = remote.dialog.showOpenDialogSync({
		properties: ['openFile'],
        filters: {name: 'MS Excell', extensions: ['xls', 'xlsx']},
        message: 'Import xlsx leden vanuit Assist'
    });

    if (!files){
        return;
    }

    console.log(files);
    const file = files[0];
    const workbook = XLSX.readFile(file);
    const sheet_name_list = workbook.SheetNames;
    const json_sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: '', raw: false});

    json_sheet.forEach((ap) => {
        let code = ap['Lidnummer'].padStart(6, '0');
        let person_id = 'n_' + code;
        let person = {
            "_id": person_id,
            "code": code,
            "first_name": ap['Voornaam'],
            "name": ap['Naam'],
            "address": ap['Adres'],
            "postcode": ap['Postcode'],
            "municipality": ap['Gemeente'],
            "email": ap['E-mail'],
            "phone": ap['GSM'].replace(/\D/g,''),
            "birth_date": ap['Geboortedatum']
        };

        db_person.put(person);

        let search_name = person.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let search_first_name = person.first_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let search_address = person.address.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        let search_email = person.email.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');

        let person_by_first_name = {
            "_id": search_first_name + search_name + '_' + person_id,
            "person_id": person_id,
            "type": "first_name"
        };
        let person_by_name = {
            "_id": search_name + search_first_name + '_' + person_id,
            "person_id": person_id,
            "type": "name"
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

el_btn_import.addEventListener('click', () => {
    importXlsxFile();
});

ipcRenderer.on('xlsx-imported', (ev, file, contents) => {

});

ipcRenderer.on('dev.nfc.on', (ev) => {
    el_nfc_reader.classList.add('bg-on');
});

ipcRenderer.on('dev.nfc.off', (ev) => {
    el_nfc_reader.classList.remove('bg-on');
    nfc_uid_to_reg = '';
});

ipcRenderer.on('nfc.on', (ev, card) => {
    el_nfc.classList.add('bg-on');
    el_nfc_uid.textContent = card.uid;

    let uid = card.uid.toLowerCase();

    db_nfc.get(uid).then((nfc) => {
        return nfc.person_id;
    }).then((person_id) => {
        return db_person.get(person_id);
    }).then((person) => {
        console.log(person);
        addReg({"id": person._id, "doc": person}, 'nfc');
        nfc_uid_to_reg = '';
    }).catch((err) => {
        console.log(err);
        console.log('nfc open to reg');
        nfc_uid_to_reg = uid;
    });
});

ipcRenderer.on('nfc.off', (ev) => {
    el_nfc.classList.remove('bg-on');
    el_nfc_uid.textContent = '---';
    nfc_uid_to_reg = '';
});

ipcRenderer.on('dev.eid.on', (ev) => {
    el_eid_reader.classList.add('bg-on');
});

ipcRenderer.on('dev.eid.off', (ev) => {
    el_eid_reader.classList.remove('bg-on');
});

ipcRenderer.on('eid.on', (ev, eid) => {

    el_eid.classList.add('bg-on');
    el_eid_national_number.textContent = eid.national_number;
    el_eid_first_names.textContent = eid.first_names;
    el_eid_name.textContent = eid.name;

    let eid_search_name = eid.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let birth_ary = eid.birth_date.toLowerCase().replace('  ', ' ').split(' ');

    console.log('BIRTH DATE');
    console.log(eid.birth_date);
    console.log(birth_ary);

    if (!eid_months[birth_ary[1]]){
        return;
    }

    let eid_search_birth_date = birth_ary[0].padStart(2, '0');
    eid_search_birth_date += '/';
    eid_search_birth_date += eid_months[birth_ary[1]].toString().padStart(2, '0');
    eid_search_birth_date += '/';
    eid_search_birth_date += birth_ary[2];

    console.log(eid_search_birth_date);

    db_person_search.allDocs({
        startkey: eid_search_name,
        endkey: eid_search_name + 'zzz',
        limit: 20,
        include_docs: true
    }).then((result) => {
        if (result.total_rows === 0){
            throw new Error('nothing found');
        }

        if (result.total_rows === 1){
            console.log('found on name');
            return db_person.get(result.rows[0]._id);
        }

        return result;

    }).then((result) => {
        if (result._id){
            addReg({'id': person._id, doc: person}, 'eid');
            throw new Error('found by name EID');
        }

        return result;
    }).then((result) => {
        let person_ids = [];

        result.rows.forEach((r) => {
            if (r.doc.type === 'birth_date'){
                return;
            }
            person_ids.push(r.doc.person_id);
        });

        return person_ids;
    }).then((person_ids) => {
        return db_person.allDocs({
            keys: person_ids,
            include_docs: true
        });
    }).then((result) => {
        result.rows.forEach((r) => {
            if (r.doc.birth_date === eid_search_birth_date){
                addReg(r, 'eid');
                return;
            }
        })
    }).catch((err) => {
        console.log(err);
    });
});

ipcRenderer.on('eid.off', (ev) => {
    el_eid.classList.remove('bg-on');
    el_eid_national_number.textContent = '---';
    el_eid_first_names.textContent = '---';
    el_eid_name.textContent = '---';
});

let reg_list = document.getElementById('reg_list');

let count = 0;

autocomplete({
    input: el_manual,
    minLength: 1,
    preventSubmit: true,
    emptyMsg: '-- Niets gevonden --',
    className: 'autocomplete',
    fetch: (text, update) => {
        let search_text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        db_person_search.allDocs({
            startkey: search_text,
            endkey: search_text + 'zzz',
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
    },
    onSelect: (item) => {
        addReg(item, 'manual');
    },
    render: (item, value) => {
        let item_div = document.createElement("div");
        item_div.setAttribute('class', 'item');
        let item_row_1_div = document.createElement("div");
        let item_row_2_div = document.createElement("div");
        item_row_1_div.setAttribute('class', 'd-flex w-100 justify-content-between');
        item_row_2_div.setAttribute('class', 'd-flex w-100 justify-content-between');

        let item_name_div = document.createElement("div");
        let item_phone_div = document.createElement("div");
        let item_address_div = document.createElement("div");
        let item_email_div = document.createElement("div");
        item_name_div.textContent = item.doc.first_name + ' ' + item.doc.name;
        item_phone_div.textContent = item.doc.phone;
        item_address_div.textContent = item.doc.address + ', ' + item.doc.postcode + ' ' + item.doc.municipality;
        item_email_div.textContent = item.doc.email;
        item_row_1_div.append(item_name_div);
        item_row_1_div.append(item_phone_div);
        item_row_2_div.append(item_address_div);
        item_row_2_div.append(item_email_div);
        item_div.append(item_row_1_div);
        item_div.append(item_row_2_div);
        return item_div;
    }
});

function registerNFC(person_id){
    if (nfc_uid_to_reg === ''){
        return;
    }

    if (nfc_uid_to_reg.length < 8){
        return;
    }

    let reg_date = new Date();

    let reg_nfc = {
        "_id": nfc_uid_to_reg,
        "person_id": person_id,
        "registered_by": "",
        "ts_utc": reg_date.toISOString(),
        "ts_local": reg_date.toString(),
        "ts_epoch": reg_date.getTime()
    };

    db_nfc.put(reg_nfc)
    .then(() => {
        return db_person_nfc_search.put({
            "_id": person_id + '_' + nfc_uid_to_reg,
            "person_id": person_id,
            "nfc_id": nfc_uid_to_reg
        });
    }).then(() => {
        nfc_uid_to_reg = '';
        console.log('registered');
    }).catch((err) => {
        console.log(err);
    });
}

function addReg(item, method){

    console.log('ITEM');
    console.log(item);

    let nfc_span = document.createElement('div');
    nfc_span.setAttribute('class', 'text-warning mr-1');
    nfc_span.textContent = ' nfc: 0';

    console.log('ITEM_ID');
    console.log(item.id);

    db_person_nfc_search.allDocs({
        startkey: item.id + '_',
        endkey: item.id + '_zzz'
    }).then((result) => {
        console.log('RESULT COUNT');
        console.log(result);
        console.log('TOTAL_ROWS');
        console.log(result.total_rows);
        nfc_span.textContent = ' nfc: ' + result.total_rows.toString();

    }).catch((err) => {
        console.log(err);
        return 0;
    });

    document.querySelectorAll('[data-nfc-reg-btn]').forEach((el) => {
        el.setAttribute('hidden', 'hidden');
    });

    count++;
    let now = new Date();
    let list_item = document.createElement('li');
    list_item.setAttribute('class', 'list-group-item');
    let justify_div = document.createElement('div');
    justify_div.setAttribute('class', 'd-flex w-100 justify-content-between');

    let btns_div = document.createElement('div');
    let nfc_btn = document.createElement('button');
    nfc_btn.setAttribute('class', 'btn btn-warning mr-1');
    nfc_btn.setAttribute('data-nfc-reg-btn', item.id);
    nfc_btn.setAttribute('type', 'button');
    nfc_btn.addEventListener('click', () => {
        registerNFC(item.id);
    });
    nfc_btn.textContent = 'NFC';
    let edit_btn = document.createElement('button');
    edit_btn.setAttribute('class', 'btn btn-primary mr-1');
    edit_btn.setAttribute('type', 'button');
    edit_btn.textContent = 'Aanpassen';
    let del_btn = document.createElement('button');
    del_btn.setAttribute('class', 'btn btn-danger');
    del_btn.setAttribute('type', 'button');
    del_btn.textContent = 'Verwijderen';

    btns_div.append(nfc_btn);
    btns_div.append(edit_btn);
    btns_div.append(del_btn);

    let data_div = document.createElement('div');
    let name_div = document.createElement('div');
    let phone_div = document.createElement('div');
    phone_div.setAttribute('class', 'd-flex w-100 justify-content-between mb-0');

    let count_span = document.createElement('span');
    count_span.textContent = count + ' .) ';
    let time_span = document.createElement('span');
    time_span.setAttribute('class', 'text-warning');
    let h_m = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    time_span.textContent = h_m + ' ';
    let name_span = document.createElement('span');
    name_span.textContent = item.doc.first_name + ' ' + item.doc.name;
    name_div.append(count_span);
    name_div.append(time_span);
    name_div.append(name_span);
    name_div.setAttribute('class', 'mb-0');

    let phone_span = document.createElement('div');
    phone_span.textContent = item.doc.phone;
    phone_div.append(phone_span);
    phone_div.append(nfc_span);

    data_div.append(name_div);
    data_div.append(phone_div);

    justify_div.append(data_div);
    justify_div.append(btns_div);
    list_item.append(justify_div);
    reg_list.prepend(list_item);
    el_manual.value = '';

    let reg = {
        "h:m": h_m,
        "person_id": item.id,
        "ts_utc": now.toISOString(),
        "ts_local": now.toString(),
        "ts_epoch": now.getTime(),
        "method": method,
        "_id": 'ts_' + now.getTime().toString() + '_' + item.id
    };

    db_reg.put(reg);
    el_manual.focus();
}

console.log('👋 This message is being logged by "renderer.js", included via webpack');
