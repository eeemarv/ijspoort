<script>
  import { Badge } from 'sveltestrap';
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';

  export let person;
  export let show_member_year = false;
  const year_str = new Date().getFullYear().toString();
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
