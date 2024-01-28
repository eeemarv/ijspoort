<script>
  import { Badge } from 'sveltestrap';
  import { person_map } from '../../services/store';

  export let year = undefined;
  export let person_id = undefined;
  export let font_size = '1em';

  $: person = $person_map.get(person_id) ?? {};
</script>

<Badge
color={person.member_year['y' + year] ? 'success' : 'dark'}
title="{person.member_year['y' + year] ? 'Lid in' : 'Geen lid in'} {year}"
class=me-2
>
  <span style="--font-size: {font_size};">{year}</span>
</Badge>

<style>
span {
  font-size: var(--font-size);
}
</style>

