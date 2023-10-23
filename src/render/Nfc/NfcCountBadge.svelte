<script>
  import { nfc_count } from '../services/store';

  export let font_size = '1em';
</script>

<span
  class="badge bg-accent"
  title="Totaal NFC-tags"
  style="--font-size: {font_size};"
>
  {$nfc_count}
</span>

<style>
span {
  font-size: var(--font-size);
}
</style>
