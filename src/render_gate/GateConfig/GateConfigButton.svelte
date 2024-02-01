<script>
  import { gate_auth } from '../../gate/gate_auth';

  export let person_id = undefined;
</script>

{#if gate_auth(person_id)}
  <button type=button class="btn btn-primary btn-lg"
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
