<script>
    import NFCCount from './NfcCount.svelte';

    export let font_size = '1em';

    let nfc_count = 0;
</script>

<NFCCount bind:nfc_count />

<span
    class="badge badge-info"
    title="Totaal aantal NFC-tags geregistreerd"
    style="--font-size: {font_size};"
>
    {nfc_count}
</span>

<style>
span {
 font-size: var(--font-size);
}
</style>
