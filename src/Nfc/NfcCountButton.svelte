<script>
  import { Button } from 'sveltestrap';
  import NfcCount from './NfcCount.svelte';
  import NfcLogModal from './NfcLogModal.svelte';

  let nfc_count = 0;
  let nfc_log_modal;
</script>

<NfcLogModal bind:this={nfc_log_modal} />

<NfcCount bind:nfc_count />


<Button
  disabled={nfc_count === 0}
  color=accent
  size=sm
  on:click={nfc_log_modal.toggle()}
  title="Totaal NFC tags.">
  {nfc_count}
</Button>