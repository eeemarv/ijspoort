<script>
  import { Button } from '@sveltestrap/sveltestrap';
  import { nfc_map } from '../../../services/store';
  import NfcLogModal from '../NfcLog/NfcLogModal.svelte';

  let toggle;
</script>

<NfcLogModal bind:toggle />

<Button
  disabled={$nfc_map.size === 0}
  color=accent
  size=sm
  on:click={toggle}
  title="Totaal NFC tags.">
  {$nfc_map.size}
</Button>