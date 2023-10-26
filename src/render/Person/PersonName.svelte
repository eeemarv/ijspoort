<script>
  import { person_table } from "../services/store";
  export let person_id;

  $: person = $person_table[person_id] ?? {};
</script>

<span title="voornaam">
    {person.firstname}
</span>
{#if person.nickname}
  <span title="roepnaam">
    ({person.nickname})
  </span>
{/if}
<span title="achternaam">
  {person.surname}
</span>
