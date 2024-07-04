<script>
  const EventEmitter = require('events');
  import { onMount } from 'svelte';
  import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
  import autocomplete from 'autocompleter';
  import AutocompleteSuggestion from './AutocompleteSuggestion.svelte';
  import { selected_person_id } from '../../services/store';
  import { member_period_filter } from '../../services/store';
  import { member_period_filter_enabled } from '../../services/store';
  import { member_person_map } from '../../services/store';
  import { person_ids_to_func_by_text } from '../../db_get/person_get';

  let el_manual;
  let el_group;
  let dropdown_open = false;

  class SearchUpdateEmitter extends EventEmitter {};
  const searchUpdateEmitter = new SearchUpdateEmitter();

  $: {
    $member_period_filter_enabled;
    $member_period_filter;
    searchUpdateEmitter.emit('update');
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

    // new member_period_filter
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
          id=member_period_filter_enabled
          bind:checked={$member_period_filter_enabled}
          title="Filter op actief lid in {$member_period_filter}"
        />
        <label class=form-check-label for=member_period_filter_enabled>
          <ButtonDropdown {dropdown_open}>
            <DropdownToggle caret
              color=success
              on:click={() => {dropdown_open = !dropdown_open;}}
              title="Filter op lidmaatschap">
                {#if $member_period_filter}
                  {$member_period_filter}
                {:else}
                  *Geen*
                {/if}
            </DropdownToggle>
            <DropdownMenu>
              {#if !$member_period_filter}
                <DropdownItem active title="Geen lidmaatschap filter geselecteerd">
                  *Geen*
                </DropdownItem>
              {/if}
              {#each [...$member_person_map.keys()].sort() as member_period(member_period)}
                <DropdownItem
                  active={member_period === $member_period_filter}
                  on:click={() => {$member_period_filter = member_period;}}
                >
                  {member_period} ({$member_person_map.get(member_period).size} leden)
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