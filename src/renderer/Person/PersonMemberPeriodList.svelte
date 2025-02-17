<script>
  import { member_person_map } from '../services/store';
  import PersonMemberPeriod from './PersonMemberPeriod.svelte';

  export let person_id = undefined;
  export let max_items = 5;
  export let font_size = '1em';
</script>

{#each [...$member_person_map.keys()].filter((k) => k !== '^').sort().slice(-1 * max_items) as member_period(member_period)}

  <PersonMemberPeriod {person_id} {member_period} {font_size} />

{/each}