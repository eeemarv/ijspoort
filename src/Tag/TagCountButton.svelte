<script>
  import { Button } from 'sveltestrap';
  import TagCount from './TagCount.svelte';
  import NfcLogModal from '../Nfc/NfcLogModal.svelte';

  let tag_count = 0;
  let nfc_log_modal;
  //on:click={nfc_log_modal.toggle()}
</script>

<!--
<NfcLogModal bind:this={tag_modal} />
-->

<TagCount bind:tag_count />

<Button
  color=accent
  size=sm
  title="Totaal Tags.">
  {tag_count}
</Button>