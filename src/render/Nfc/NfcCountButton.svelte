<script>
  import { Button } from 'sveltestrap';
  import NfcLogModal from './NfcLogModal.svelte';
  import { nfc_table } from '../services/store';

  let nfc_log_modal;
  let nfc_count = 0;
  $: nfc_count = Object.keys($nfc_table).length;
</script>

<NfcLogModal bind:this={nfc_log_modal} />

<Button
  disabled={nfc_count === 0}
  color=accent
  size=sm
  on:click={nfc_log_modal.toggle()}
  title="Totaal NFC tags.">
  {nfc_count}
</Button>