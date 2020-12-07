<script>
    import { onMount } from 'svelte';
    import { fetch_man_search } from './../services/person_man_search';
    import autocomplete from 'autocompleter';
    import AutocompleteSuggestion from './AutocompleteSuggestion.svelte';

    let el_manual;

    onMount(() => {
        autocomplete({
            input: el_manual,
            minLength: 1,
            preventSubmit: true,
            emptyMsg: '-- Niets gevonden --',
            className: 'autocomplete',
            fetch: (text, update) => {
                fetch_man_search(text, update);
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
    <label for="manual">
        Manuele selectie lid (Assist database)
    </label>
    <input type="text" id="manual" class="form-control" aria-describedby="manual_help" value="" bind:this={el_manual}>
    <span id="manual_help">
        Typ voornaam, achternaam, adres, emaill of telefoonnummer om auto-suggesties te krijgen
    </span>
</div>