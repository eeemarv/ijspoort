<script>
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import minusIcon from '@iconify/icons-fa/minus';
  import { TabPane, Card, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'sveltestrap';
  import { gate_nfc_enabled, gate_nfc_open_time, member_period_select, member_person_map } from '../../services/store';

  export let tab;
  let dropdown_open = false;
</script>

<TabPane tabId=members active={tab === 'members'}>
  <span slot=tab>
    Leden
  </span>
  <Card body>
    <div class=form-group>
      <label class=form-check-label for=gate_members_only_enabled>
        Toegang enkel voor leden / periode
      </label>

      <div class="input-group-text input-form-group-lg">
        <div class=form-check>
          <input class="form-check-input ms-0 me-3"
            type=checkbox
            id=gate_members_only_enabled
            bind:checked={$gate_nfc_enabled}
            title="Enkel leden in {$member_period_select}"
          />
          <label class=form-check-label for=member_period_filter_enabled>
            <ButtonDropdown {dropdown_open}>
              <DropdownToggle caret
                color={$member_period_select === '^' ? 'warning' : $member_period_select ? 'success' : 'grey'}
                on:click={() => {dropdown_open = !dropdown_open;}}
                title="Lidmaatschap periode">
                  {#if $member_period_select === '^'}
                    Geen lid
                  {:else if $member_period_select}
                    {$member_period_select}
                  {:else}
                    *Geen selectie*
                  {/if}
              </DropdownToggle>
              <DropdownMenu>
                {#if !$member_period_select}
                  <DropdownItem active title="Geen lidmaatschap filter geselecteerd">
                    <Badge color=grey>
                      *Geen filter*
                    </Badge>
                  </DropdownItem>
                {/if}
                {#each [...$member_person_map.keys()].filter(k => k !== '^').sort().reverse() as member_period(member_period)}
                  <DropdownItem
                    active={member_period === $member_period_select}
                    on:click={() => {$member_period_select = member_period;}}
                  >
                    <Badge color=success class=me-2>
                      {member_period}
                    </Badge>
                    {$member_person_map.get(member_period).size} leden
                  </DropdownItem>
                {/each}
              </DropdownMenu>
            </ButtonDropdown>
          </label>
        </div>
    </div>

    <div class=form-group>
      <label for=gate_nfc_open_time>
        Tijd waarna poort automatisch dichtvalt (sec)
      </label>

      <div class="input-group input-group-lg">
        <input
          type=number
          id=gate_nfc_open_time
          tabindex=0
          class="form-control input-lg"
          bind:value={$gate_nfc_open_time}
          min=0
          max=999
          disabled={!$gate_nfc_enabled}
          on:keypress
        />

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={gate_nfc_open_time.dec}
            disabled={!$gate_nfc_enabled}
          >
            <Icon icon={minusIcon} />
          </button>
        </div>

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={gate_nfc_open_time.inc}
            disabled={!$gate_nfc_enabled}
          >
            <Icon icon={plusIcon} />
          </button>
        </div>

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={() => $gate_nfc_open_time = 8}
            disabled={!$gate_nfc_enabled}
          >
            8
          </button>
        </div>

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={() => $gate_nfc_open_time = 10}
            disabled={!$gate_nfc_enabled}
          >
            10
          </button>
        </div>

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={() => $gate_nfc_open_time = 12}
            disabled={!$gate_nfc_enabled}
          >
            12
          </button>
        </div>

        <div class="input-group-append">
          <button
              class="btn btn-info btn-lg"
              type="button"
              on:click={() => $gate_nfc_open_time = 14}
              disabled={!$gate_nfc_enabled}
            >
              14
            </button>
          </div>
      </div>
    </div>
  </Card>
</TabPane>

<style>
button {
  font-weight: bold;
  font-size: 1.4em;
  min-width: 3em;
}
input {
  font-weight: bold;
  font-size: 1.4em;
}
label {
  font-size: 1.4em;
}
</style>
