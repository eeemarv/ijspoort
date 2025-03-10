<script>
  import { Badge } from 'sveltestrap';
  import { ButtonDropdown } from 'sveltestrap';
  import { DropdownItem } from 'sveltestrap';
  import { DropdownMenu } from 'sveltestrap';
  import { DropdownToggle } from 'sveltestrap';
  import { member_person_map } from '../../services/store';

  export let dropdown_open = false;
  export let member_period = undefined;
  export let id = 'member_period';
  export let show_not_member = false;
</script>

<ButtonDropdown {dropdown_open} {id}>
  <DropdownToggle caret
    color={member_period === '^' ? 'warning' : member_period ? 'success' : 'grey'}
    on:click={() => {dropdown_open = !dropdown_open;}}
    title="Filter op lidmaatschap">
      {#if member_period === '^'}
        Geen lid
      {:else if member_period}
        {member_period}
      {:else}
        *Geen filter*
      {/if}
  </DropdownToggle>
  <DropdownMenu>
    {#if !member_period}
      <DropdownItem active title="Geen lidmaatschap filter geselecteerd">
        <Badge color=grey>
          *Geen filter*
        </Badge>
      </DropdownItem>
    {/if}
    {#each [...$member_person_map.keys()].filter(k => k !== '^').sort() as mp(mp)}
      <DropdownItem
        active={member_period === mp}
        on:click={() => {member_period = mp;}}
      >
        <Badge color=success class=me-2>
          {mp}
        </Badge>
        {$member_person_map.get(mp).size} leden
      </DropdownItem>
    {/each}
    {#if $member_person_map.has('^') && show_not_member}
      <DropdownItem
        active={member_period === '^'}
        on:click={() => {member_period = '^';}}
      >
        <Badge color=warning class=me-2>
         Geen lid
        </Badge>
        {$member_person_map.get('^').size} personen
      </DropdownItem>
    {/if}
  </DropdownMenu>
</ButtonDropdown>