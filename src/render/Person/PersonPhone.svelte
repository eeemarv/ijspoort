<script>
  export let person;
</script>

{#if person.phone_mobile }
  <span title="gsm">
    {person.phone_mobile}
  </span>
{:else if person.phone_home}
  <span title="telefoon thuis">
    {person.phone_home}
  </span>
{:else if person.phone_work}
  <span title="telefoon werk">
    {person.phone_work}
  </span>
{:else}
  <span>&nbsp;</span>
{/if}
