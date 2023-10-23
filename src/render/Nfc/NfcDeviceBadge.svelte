<script>
  import NfcDevice from './NfcDevice.svelte';

  export let font_size = '1em';
  let on;
  let error;
</script>

<NfcDevice bind:on bind:error />

<span class="badge me-2"
  class:bg-success={on && !error}
  class:bg-danger={error}
  class:bg-dark={!on && !error}
  title="Status NFC tag scanner"
  style="font-size: {font_size};"
>
  NFC
</span>

<style>
  span {
    font-size: var(--font-size);
  }
</style>