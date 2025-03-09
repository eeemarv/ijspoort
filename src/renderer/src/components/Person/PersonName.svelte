<script>
  import { person_map } from '../services/store';

  export let person_id;

  $: person = $person_map.get(person_id);
</script>

{#if person}
  <span title="voornaam">
      {person.firstname ?? '***'}
  </span>
  {#if person.nickname}
    <span title="roepnaam">
      ({person.nickname})
    </span>
  {/if}
  <span title="achternaam">
    {person.surname ?? '***'}
  </span>
{:else}
  <span class="badge badge-outlined">
    <i>
      Geen persoonsdata
    </i>
  </span>
{/if}

<style>
span.badge-outlined {
  background-color: transparent;
  border: 1px solid grey;
}
</style>
