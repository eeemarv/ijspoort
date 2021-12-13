<script>
  import NfcCount from './NfcCount.svelte';

  export let font_size = '1em';

  let nfc_count = 0;
</script>

<NfcCount bind:nfc_count />

<span
  class="badge bg-accent"
  title="Totaal NFC-tags"
  style="--font-size: {font_size};"
>
  {nfc_count}
</span>

<style>
span {
  font-size: var(--font-size);
}
</style>
