<script>
  import GateConfig from './GateConfig.svelte';

  export let person;
  export let open = false;
</script>

<GateConfig {open} />

{#if person.group && person.group.trim() !== ''}
  <button type=button class="btn btn-primary btn-lg"
    on:click={() => open = true}
    on:click
  >
    Instellingen
  </button>
{/if}

<style>
button {
  font-size: 1.6em;
}
</style>
