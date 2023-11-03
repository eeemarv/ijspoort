<script>
  const EventEmitter = require('events');
  import { onMount } from 'svelte';
  import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
  import { db_person } from '../services/db';
  import autocomplete from 'autocompleter';
  import AutocompleteSuggestion from './AutocompleteSuggestion.svelte';
  import { selected_person_id } from './../services/store';
  import { focus_year } from './../services/store';
  import { focus_year_filter_enabled } from './../services/store';

  let select_years = [];
  let el_manual;
  let el_group;
  let dropdown_open = false;

  class SearchUpdateEmitter extends EventEmitter {};
  const searchUpdateEmitter = new SearchUpdateEmitter();

  $: {
    $focus_year_filter_enabled;
    $focus_year;
    searchUpdateEmitter.emit('update');
  }

  const search_func = (text, update) => {
    let search_text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    if (search_text === ''){
      update([]);
      return;
    }
    if ($focus_year_filter_enabled){
      search_text = 'y' + $focus_year + '_' + search_text;
    }

    db_person.query('search/count_by_text', {
      startkey: search_text,
      endkey: search_text + '\uffff',
      limit: 20,
      include_docs: false,
      reduce: false
    }).then((res) => {

      console.log('MANUAL RES.', res);

      let result_keys = {};

      res.rows.every((v) => {

        if (Object.keys(result_keys).length > 10){
          return false;
        };

        result_keys[v.id] = true;

        return true;
      });

      update(Object.keys(result_keys));

    }).catch((err) => {
      console.log(err);
    });
  };

  const update_select_years = () => {
    select_years = [];
    let year_now = (new Date()).getFullYear();
    for(let y = year_now - 5; y < year_now + 2; y++){
      select_years = [...select_years, y];
    }
    console.log(select_years);
  };

  onMount(() => {
    update_select_years();

    autocomplete({
      input: el_manual,
      minLength: 1,
      preventSubmit: true,
      emptyMsg: '-- Niets gevonden --',
      className: 'autocomplete',
      fetch: search_func,
      onSelect: (person_id) => {
        $selected_person_id = person_id;
        el_manual.value = '';
      },
      render: (item) => {
        const div = document.createElement("div");
        div.setAttribute('class', 'autocomplete-suggestion');
        new AutocompleteSuggestion({
          target: div,
          props: {
            person_id: item
          }
        });
        return div;
      },
      renderGroup: () => {''},
      customize: (input, inputRect, container, maxHeight) => {
        container.style.width = Math.round(el_group.getBoundingClientRect().width - 40) + 'px';
      }
    });

    // new focus_year or year_filter
    searchUpdateEmitter.on('update', () => {
      // see https://github.com/kraaden/autocomplete/issues/52
      setTimeout(() => {
        el_manual.dispatchEvent(new KeyboardEvent('keyup'));
      }, 200);
    });
  });
</script>

<div class="form-group">
  <label for="manual">
    Manuele selectie lid (Assist database)
  </label>
  <div class="input-group input-group-lg" bind:this={el_group}>
    <input type="text" id="manual"
      tabindex="0" class="form-control input-lg"
      aria-describedby="manual_help"
      value="" bind:this={el_manual}
    />
    <span class="input-group-text">
      <div class="form-check ml-2">
        <input class=form-check-input
          type=checkbox
          id=focus_year_filter_enabled
          bind:checked={$focus_year_filter_enabled}
          title="Filter op actief lid in {$focus_year}"
        />
        <label class=form-check-label for=yaer_filter_enabled>
          <ButtonDropdown {dropdown_open}>
            <DropdownToggle caret
              color=success
              on:click={() => {dropdown_open = !dropdown_open;}}
              title="Focus op lidjaar">
              {$focus_year}
            </DropdownToggle>
            <DropdownMenu>
              {#each select_years as y}
                <DropdownItem
                  active={y === $focus_year}
                  on:click={() => {$focus_year = y;}}
                >
                  {y}
                </DropdownItem>
              {/each}
            </DropdownMenu>
          </ButtonDropdown>
        </label>
      </div>
    </span>
  </div>
  <span id="manual_help">
    Typ voornaam, achternaam, adres, email, lid- of telefoonnummer om auto-suggesties te krijgen
  </span>
</div>