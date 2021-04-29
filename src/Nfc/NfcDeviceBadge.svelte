<script>
  import NfcDevice from './NfcDevice.svelte';

  let on;
  let error;
</script>

<NfcDevice bind:on bind:error />

<span class="badge mr-2"
  class:badge-success={on && !error}
  class:badge-danger={error}
  class:badge-dark={!on && !error}
  title="Status NFC tag scanner"
>
  NFC
</span>

<style>
span {
  font-size: 1.3em;
}
</style>