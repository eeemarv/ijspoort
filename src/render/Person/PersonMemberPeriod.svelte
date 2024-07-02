<script>
  import { Badge } from 'sveltestrap';
  import { member_person_map } from '../../services/store';

  export let member_period = undefined;
  export let person_id = undefined;
  export let font_size = '1em';

  $: is_member = person_id && member_period
    && $member_person_map.has(member_period)
    && $member_person_map.get(member_period).has(person_id);

</script>

<Badge
color={ is_member ? 'success' : 'dark'}
title="{ is_member ? 'Lid in' : 'Geen lid in'} {member_period}"
class=me-2
>
  <span style="--font-size: {font_size};">{member_period}</span>
</Badge>

<style>
span {
  font-size: var(--font-size);
}
</style>
