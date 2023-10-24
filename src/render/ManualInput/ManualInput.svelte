<script>
  const EventEmitter = require('events');
  import { onMount } from 'svelte';
  import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
  import { db_person, db_tag } from '../services/db';
  import autocomplete from 'autocompleter';
  import AutocompleteSuggestion from './AutocompleteSuggestion.svelte';
  import { person, focus_year } from './../services/store';
  import { focus_year_filter_enabled } from './../services/store';
  import { tag_type_enabled_sorted_id_ary } from './../services/store';

  let select_years = [];
  let el_manual;
  let el_group;
  let dropdown_open = false;
  let person_tags = {};

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

      let result_keys = {};

      let tag_search_keys = [];

      res.rows.every((v) => {
        if (result_keys[v.id] !== undefined){
          return true;
        }
        if (Object.keys(result_keys).length > 10){
          return false;
        };

        $tag_type_enabled_sorted_id_ary.forEach((tid) => {
          tag_search_keys = [...tag_search_keys, tid + '_' + v.id];
        })

        result_keys[v.id] = true;

        return true;
      });

      update(Object.keys(result_keys));

      return db_tag.query('search/count_by_type_id_and_person_id', {
        keys: tag_search_keys,
        reduce: true,
        group: true,
        include_docs: false
      });

    }).then((res) => {
      let p_tag_types = {};
      res.rows.forEach((r) => {
        let rparts = r.key.split('_');
        let tag_type_id = rparts[0] + '_' + rparts[1];
        let p_id = rparts[2];
        if (typeof p_tag_types[p_id] !== 'object'){
          p_tag_types[p_id] = [];
        }
        for (let i = 0; i < r.value; i++){
          p_tag_types[p_id] = [...p_tag_types[p_id], tag_type_id];
        }
      });
      Object.keys(p_tag_types).forEach((prsn_id) => {
        person_tags[prsn_id] = p_tag_types[prsn_id];
      });
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
      onSelect: (item) => {
        console.log(item);
        $person = item;
        el_manual.value = '';
      },
      render: (person_id) => {
        let suggestion_div = document.createElement("div");
        suggestion_div.setAttribute('class', 'autocomplete-suggestion');
        new AutocompleteSuggestion({
          target: suggestion_div,
          props: {
            person_id: person_id,
            tags: person_tags[person_id] ?? []
          }
        });
        return suggestion_div;
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