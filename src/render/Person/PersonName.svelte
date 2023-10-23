<script>
  export let person;
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
