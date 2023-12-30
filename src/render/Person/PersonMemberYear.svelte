<script>
  import { person_map } from '../services/store';
  import { Badge } from 'sveltestrap';
  import { member_year_person_map } from '../services/store';

  export let person_id = undefined;

  $: person = $person_map.get(person_id) ?? {};

</script>

{#each [...$member_year_person_map.keys()].slice(-5) as yk(yk)}

  <Badge
    color={person.member_year[yk] ? 'success' : 'dark'}
    title="{person.member_year[yk] ? 'Lid in' : 'Geen lid in'} {yk.substring(1)}"
    class=me-2
  >
    {yk.substring(1)}
  </Badge>
{/each}