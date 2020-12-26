<script>
  export let person;
</script>

<span title="voornaam">
    {person.firstname}
</span>
&nbsp;
{#if person.nickname}
  <span title="roepnaam">
    ({person.nickname})
  </span>
  &nbsp;
{/if}
<span title="achternaam">
  {person.surname}
</span>
