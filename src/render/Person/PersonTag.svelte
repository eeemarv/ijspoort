<script>
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import { focus_year } from '../services/store';
  import PersonFocusYearTag from './PersonFocusYearTag.svelte';

  export let person;
  export let show_member_year = false;
</script>

<PersonMemberId member_id={person.member_id} />
&nbsp;
<PersonName {person} />
{#if show_member_year && person.member_year && person.member_year['y' + $focus_year]}
  &nbsp;
  <PersonFocusYearTag />
{/if}
