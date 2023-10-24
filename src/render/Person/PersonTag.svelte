<script>
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import { focus_year } from '../services/store';
  import PersonFocusYearTag from './PersonFocusYearTag.svelte';
  import { person_table } from '../services/store';

  export let person;
  export let person_id;
  export let show_member_year = false;
//export let show_tags = false;

  $: if (person_id !== undefined){
    person = $person_table[person_id];
  }
</script>

<PersonMemberId member_id={person.member_id} />
&nbsp;
<PersonName {person} />
{#if show_member_year && person.member_year && person.member_year['y' + $focus_year]}
  &nbsp;
  <PersonFocusYearTag />
{/if}
