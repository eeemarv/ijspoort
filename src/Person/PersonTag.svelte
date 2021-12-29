<script>
  import { Badge } from 'sveltestrap';
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import { focus_year } from '../services/store';

  export let person;
  export let show_member_year = false;
</script>

<PersonMemberId member_id={person.member_id} />
&nbsp;
<PersonName {person} />
{#if show_member_year && person.member_year && person.member_year['y' + $focus_year]}
  &nbsp;
  <Badge color=success title="lid in {$focus_year.toString()}">
    {$focus_year.toString()}
  </Badge>
{/if}
