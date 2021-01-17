<script>
    import { onMount } from 'svelte';
    import { db_person } from '../services/db';
    import autocomplete from 'autocompleter';
    import AutocompleteSuggestion from './AutocompleteSuggestion.svelte';
    import { person } from './../services/store';

    const search_func = (text, update) => {
        let search_text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
        if (search_text === ''){
            update([]);
            return;
        }
        db_person.query('search/by_text', {
            startkey: search_text,
            endkey:search_text + '\uffff',
            limit: 30,
            include_docs: true
        }).then((res) => {
            let docs = {};
            let count_docs = 0;
            res.rows.forEach((v) => {
                if (!docs[v.id] && count_docs < 7){
                    docs[v.id] = v.doc;
                    count_docs++;
                }
            });
            update(Object.values(docs));
        }).catch((err) => {
            console.log(err);
        })
    };

    let el_manual;

    onMount(() => {
        autocomplete({
            input: el_manual,
            minLength: 1,
            preventSubmit: true,
            emptyMsg: '-- Niets gevonden --',
            className: 'autocomplete',
            fetch: search_func,
            onSelect: (item) => {
                console.log(item);
                $person = item;
                el_manual.value = '';
            },
            render: (item) => {
                let suggestion_div = document.createElement("div");
                suggestion_div.setAttribute('class', 'autocomplete-suggestion');
                new AutocompleteSuggestion({
                    target: suggestion_div,
                    props: {
                        person: item
                    }
                });
                return suggestion_div;
            },
            renderGroup: () => {''}
        });
    });
</script>

<div class="form-group">
    <label for="manual">
        Manuele selectie lid (Assist database)
    </label>
    <input type="text" id="manual" tabindex="0" class="form-control" aria-describedby="manual_help" value="" bind:this={el_manual}>
    <span id="manual_help">
        Typ voornaam, achternaam, adres, email, lid- of telefoonnummer om auto-suggesties te krijgen
    </span>
</div>