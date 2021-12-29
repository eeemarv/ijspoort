<script>
  import { Badge } from 'sveltestrap';
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import { focus_year } from '../services/store';

  export let person;
  export let show_member_year = false;

  $: year_str = $focus_year.toString();
</script>

<PersonMemberId member_id={person.member_id} />
&nbsp;
<PersonName {person} />
{#if show_member_year && person.member_year && person.member_year['y' + year_str]}
  &nbsp;
  <Badge color=success title="lid in {year_str}">
    {year_str}
  </Badge>
{/if}
