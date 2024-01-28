<script>
  import { member_year_person_map } from '../../services/store';
  import PersonMemberYear from '../../render/Person/PersonMemberYear.svelte';

  export let person_id = undefined;
</script>

{#each [...$member_year_person_map.keys()].slice(-5) as yk(yk)}

  <PersonMemberYear {person_id} year={yk.substring(1)} />

{/each}