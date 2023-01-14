<script>
  import { Button } from 'sveltestrap';
  import NfcLogModal from './NfcLogModal.svelte';
  import { nfc_count } from '../services/store';

  let nfc_log_modal;
</script>

<NfcLogModal bind:this={nfc_log_modal} />

<Button
  disabled={$nfc_count === 0}
  color=accent
  size=sm
  on:click={nfc_log_modal.toggle()}
  title="Totaal NFC tags.">
  {$nfc_count}
</Button>