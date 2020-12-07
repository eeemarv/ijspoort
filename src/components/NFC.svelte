<script>
    import { Card, CardBody, CardFooter, CardHeader, CardText } from 'sveltestrap';
    import { Button } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');

    let dev_status = 'off';
    let nfc_status = 'off';
    let uid = '';
    let saveable = false;

    ipcRenderer.on('dev.nfc.on', (ev) => {
        dev_status = 'ok';
    });
    ipcRenderer.on('dev.nfc.off', (ev) => {
        dev_status = 'off';
    });
    ipcRenderer.on('dev.nfc.error', (ev) => {
        dev_status = 'error';
    });
    ipcRenderer.on('nfc.on', (ev, card) => {
        uid = card.uid;
        nfc_status = 'ok';
    });
    ipcRenderer.on('nfc.off', (ev) => {
        uid = '';
        nfc_status = 'off';
    });

</script>

<Card class=m-3>
    <div class="card-header py-2"
        class:bg-success={dev_status === 'ok'}
        class:bg-danger={dev_status === 'error'}
    >
        NFC
        {dev_status === 'error' ? ' fout apparaat' : ''}
    </div>
    <div class="card-body py-2"
        class:bg-success={nfc_status === 'ok'}
        class:bg-warning={nfc_status === 'not_found'}
        class:bg-danger={nfc_status === 'unvalid'}>
        <CardText class="py-0 mb-0">
            {uid ? uid : '---'}
        </CardText>



    </div>
    <CardFooter class="d-flex w-100 justify-content-end">
        <Button color=accent title="link persoon aan NFC-tag">
            Schrijf
        </Button>
    </CardFooter>
</Card>