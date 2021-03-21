<script>
    const { ipcRenderer } = window.require('electron');
    import { setTimeout } from 'timers';
    import NFCCount from './NFCCount.svelte';

    let on = false;
    let error = false;

    ipcRenderer.on('dev.nfc.on', (ev) => {
        on = true;
    });
    ipcRenderer.on('dev.nfc.off', (ev) => {
        on = false;
    });
    ipcRenderer.on('dev.nfc.error', (ev) => {
        error = true;
        setTimeout(() => {
            error = false;
        }, 5000);
    });

</script>

<div class="card-header py-2 d-flex w-100 justify-content-between"
    class:bg-success={on && !error}
    class:bg-danger={error}
>
    <div title="NFC/RFiD tags">
    NFC
    {error ? ' fout apparaat' : ''}
    </div>
    <div>
        <NFCCount />
    </div>
</div>
