<script>
  import { Button } from 'sveltestrap';
  import { nfc_map } from '../services/store';
  import NfcLogModal from '../NfcLog/NfcLogModal.svelte';

  let nfc_log_modal;
</script>

<NfcLogModal bind:this={nfc_log_modal} />

<Button
  disabled={$nfc_map.size === 0}
  color=accent
  size=sm
  on:click={nfc_log_modal.toggle()}
  title="Totaal NFC tags.">
  {$nfc_map.size}
</Button>