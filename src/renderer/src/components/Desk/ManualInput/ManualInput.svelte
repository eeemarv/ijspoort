<script>
  import { onMount } from 'svelte';
  import autocomplete from 'autocompleter';
  import AutocompleteSuggestion from './AutocompleteSuggestion.svelte';
  import { desk_selected_person_id } from '../../services/store';
  import { desk_member_period_filter } from '../../services/store';
  import { desk_member_period_filter_enabled } from '../../services/store';
  import { person_ids_to_func_by_text } from '../../db_get/person_get';
  import MemberPeriodDropdown from '../../Common/MemberPeriodDropdown.svelte';
  import { ev_manual } from '../../services/events';

  let el_manual;
  let el_group;
  let dropdown_open = false;

  $: {
    $desk_member_period_filter_enabled;
    $desk_member_period_filter;
    ev_manual.dispatchEvent(new Event('update'));
  }

  onMount(() => {

    autocomplete({
      input: el_manual,
      minLength: 1,
      preventSubmit: true,
      emptyMsg: '-- Niets gevonden --',
      className: 'autocomplete',
      fetch: person_ids_to_func_by_text,
      onSelect: (person_id) => {
        $desk_selected_person_id = person_id;
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

    // new desk_member_period_filter
    ev_manual.addEventListener('update', () => {
      // see https://github.com/kraaden/autocomplete/issues/52
      setTimeout(() => {
        el_manual.dispatchEvent(new KeyboardEvent('keyup'));
      }, 200);
    });
  });
</script>

<div class="form-group">
  <div class="d-flex w-100 justify-content-between">
    <label for="manual">
      Manuele selectie lid (Assist database)
    </label>
    <label for="desk_member_period_filter_enabled">
      Filter lidmaatschap
    </label>
  </div>
  <div class="input-group" bind:this={el_group}>
    <input type="text" id="manual"
      tabindex="0" class="form-control"
      aria-describedby="manual_help"
      value="" bind:this={el_manual}
    />
    <span class="input-group-text">
      <div class="form-check ml-2">
        <input class=form-check-input
          type=checkbox
          id=desk_member_period_filter_enabled
          bind:checked={$desk_member_period_filter_enabled}
          title="Filter op actief lid in {$desk_member_period_filter}"
        />
        <label class=form-check-label for=desk_member_period_filter_enabled>
          <MemberPeriodDropdown
            {dropdown_open}
            bind:member_period={$desk_member_period_filter}
            show_not_member
          />
        </label>
    </span>
  </div>
  <span id="manual_help">
    Typ voornaam, achternaam, adres, email, lid- of telefoonnummer om auto-suggesties te krijgen
  </span>
</div>