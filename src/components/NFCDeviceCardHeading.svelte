<script>
    import NFCCountButton from './NFCCountButton.svelte';
    import NFCDevice from './NFCDevice.svelte';

    let on;
    let error;
</script>

<NFCDevice bind:on bind:error />

<div class="card-header py-2 d-flex w-100 justify-content-between"
    class:bg-success={on && !error}
    class:bg-danger={error}
>
    <div title="NFC/RFiD tags">
    NFC
    {error ? ' fout apparaat' : ''}
    </div>
    <div>
        <NFCCountButton />
    </div>
</div>
