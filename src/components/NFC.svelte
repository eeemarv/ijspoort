<script>
    import { ipcRenderer } from 'electron';

    let dev_on = false;
    let uid = '';
    let uid_ok = false;
    let uid_unknown = false;

    ipcRenderer.on('dev.nfc.on', (ev) => {
        dev_on = true;
    });

    ipcRenderer.on('dev.nfc.off', (ev) => {
        dev_on = false;
    });

    ipcRenderer.on('nfc.on', (ev, card) => {
        uid = card.uid;
        uid_ok = true;
    });

    ipcRenderer.on('nfc.off', (ev) => {
        uid_ok = false;
        uid_unknown = false;
        uid = '';
    });

</script>

<div class="card text-white border border-white m-3">
<div class="card-body border-bottom border-white py-2" class:bg-on={dev_on}>NFC</div>
<div class="card-body py-2"
    class:bg-on={uid_ok}
    class:bg-warning={uid_unknown}>
    <p class="card-text py-0 mb-0">
        {uid ? uid : '---'}
    </p>
</div>
</div>