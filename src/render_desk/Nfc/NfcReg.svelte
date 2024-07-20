<script>
  import { Badge, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Input } from 'sveltestrap';
  import { desk_nfc_auto_reg_enabled } from '../../services/store';
  import { member_period_select } from '../../services/store';
  import { members_only_enabled } from '../../services/store';
  import { member_person_map } from '../../services/store';

  let dropdown_open = false;

</script>

<div class="list-group-item">
  <Input
    id=desk_nfc_auto_reg_enabled
    type=checkbox
    label="Registratie"
    bind:checked={$desk_nfc_auto_reg_enabled}
  />
  <div class=form-check>
    <input class="form-check-input"
      type=checkbox
      id=members_only_enabled
      bind:checked={$members_only_enabled}
      title="Registreer enkel leden in {$member_period_select} als geldig"
    />
    <label class=form-check-label for=members_only_enabled>
      <span>
        geldig in
      </span>
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
                *Geen selectie*
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
