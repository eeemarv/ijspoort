<script>
export let reg = undefined;
</script>

{#if reg && reg.invalid}
  <span class="invalid" title="Reden ongeldig">
    {#if reg.invalid.ts_recent}
      reeds geregistreerd
      {#if reg.invalid.blocked_nfc}
        ,&nbsp;
      {/if}
    {/if}
    {#if reg.invalid.blocked_nfc}
      NFC geblokkeerd
      {#if reg.invalid.not_member_in}
        ,&nbsp;
      {/if}
    {/if}
    {#if reg.invalid.not_member_in}
      Geen lid in <span class="bg-success member">{reg.invalid.not_member_in}</span>
    {/if}
  </span>
{/if}

<style>
  span.invalid {
    background-color: rgb(120, 40, 40);
    padding: .2em;
    border-radius: .2em;
  }
  span.member {
    margin: 0;
    padding: .2em .1em;
  }
</style>