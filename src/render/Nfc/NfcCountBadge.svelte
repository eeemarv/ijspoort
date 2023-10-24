<script>
  import { nfc_table } from '../services/store';

  export let font_size = '1em';

  let nfc_count = 0;

  $: nfc_count = Object.keys($nfc_table).length;
</script>

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
