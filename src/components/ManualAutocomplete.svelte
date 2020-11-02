<script>
    import { onMount } from 'svelte';
    import autocomplete from 'autocompleter';
    import PouchDB from 'pouchdb';
    import AutocompleteSuggestion from './AutocompleteSuggestion.svelte';

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
            let suggestion_div = document.createElement("div");
            suggestion_div.setAttribute('class', 'autocomplete-suggestion');
            new AutocompleteSuggestion({
                target: suggestion_div,
                props: {
                    person: item.doc
                }
            });
            return suggestion_div;
        }
    });
    });
</script>

<div class="form-group">
    <label for="manual">Manuele selectie van lid</label>
    <input type="text" id="manual" class="form-control" aria-describedby="manual_help" value="" bind:this={el_manual}>
    <span id="manual_help">Typ voornaam, achternaam, adres, emaill of telefoonnummer om auto-suggesties te krijgen</span>
</div>