<script>
    import { Card, CardText } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');

    let dev_status = 'off';
    let uid = '';
    let uid_ok = false;
    let uid_unknown = false;
    let not_writable = false;

    ipcRenderer.on('dev.nfc.on', (ev) => {
        dev_status = 'on';
    });
    ipcRenderer.on('dev.nfc.off', (ev) => {
        dev_status = 'off';
    });
    ipcRenderer.on('dev.nfc.error', (ev) => {
        dev_status = 'error';
    });
    ipcRenderer.on('nfc.on', (ev, card) => {
        uid = card.uid;
        uid_ok = true;
    });
    ipcRenderer.on('nfc.off', (ev) => {
        uid = '';
        uid_ok = false;
        uid_unknown = false;
    });

</script>

<Card class="text-white border border-white m-3">
    <div class="card-body border-bottom border-white py-2"
        class:bg-on={dev_status === 'on'}
        class:bg-danger={dev_status === 'error'}>
        NFC
        {dev_status === 'error' ? ' fout apparaat' : ''}

    </div>
    <div class="card-body py-2"
        class:bg-on={uid !== ''}
        class:bg-warning={uid_unknown}
        class:bg-danger={not_writable}>
        <CardText class="py-0 mb-0">
            {uid ? uid : '---'}
        </CardText>
    </div>
</Card>