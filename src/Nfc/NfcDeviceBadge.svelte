<script>
  import NfcDevice from './NfcDevice.svelte';

  let on;
  let error;
</script>

<NfcDevice bind:on bind:error />

<span class="badge me-2"
  class:bg-success={on && !error}
  class:bg-danger={error}
  class:bg-dark={!on && !error}
  title="Status NFC tag scanner"
>
  NFC
</span>

<style>
span {
  font-size: 1.3em;
}
</style>