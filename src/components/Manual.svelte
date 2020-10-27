<script>
    import { onMount } from 'svelte';
    import autocomplete from 'autocompleter';
    import PouchDB from 'pouchdb';


    //const PouchDB = require('pouchdb').default;
// PouchDB.plugin(require('pouchdb-find'));
const db_prefix = 'ijspoort_';
const db_reg = new PouchDB(db_prefix + 'reg');
const db_nfc = new PouchDB(db_prefix + 'nfc');
const db_eid = new PouchDB(db_prefix + 'eid');
const db_person = new PouchDB(db_prefix + 'person');
const db_person_search = new PouchDB(db_prefix + 'person_search');

    let el_manual;

    onMount(() => {
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
    });
</script>

<div class="form-group">
    <label for="manual">Manuele selectie van lid</label>
    <input type="text" id="manual" class="form-control" aria-describedby="manual_help" value="" bind:this={el_manual}>
    <span class="form-text">Typ voornaam, achternaam, adres, emaill of telefoonnummer om auto-suggesties te krijgen</span>
</div>