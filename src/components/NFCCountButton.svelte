<script>
    import { Button } from 'sveltestrap';
    import NfcCount from './NFCCount.svelte';
    import NfcLogModal from './NFCLogModal.svelte';

    let nfc_count = 0;
    let nfc_log_modal;
</script>

<NfcLogModal bind:this={nfc_log_modal} />

<NfcCount bind:nfc_count />


<Button
    disabled={nfc_count === 0}
    color=info
    size=sm
    on:click={nfc_log_modal.toggle()}
    title="Totaal aantal geregistreerde NFC tags. Klik voor log van laatste 20.">
    {nfc_count}
</Button>