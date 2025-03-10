<script>
  import { nfc_map } from '../../../services/store';

  export let font_size = '1em';

</script>

<span
  class="badge bg-accent"
  title="Totaal NFC-tags"
  style="--font-size: {font_size};"
>
  {$nfc_map.size}
</span>

<style>
span {
  font-size: var(--font-size);
}
</style>
