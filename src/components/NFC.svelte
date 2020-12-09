<script>
    import { Badge, Card, CardFooter, CardText } from 'sveltestrap';
    import { Button } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');
    import { nfc_uid, person } from './../services/store';

    let dev_status = 'off';
    let nfc_status = 'off';

    $: can_activate = $person && $nfc_uid;

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
        $nfc_uid = card.uid;
        nfc_status = 'ok';
    });
    ipcRenderer.on('nfc.off', (ev) => {
        $nfc_uid = undefined;
        nfc_status = 'off';
    });

</script>

<Card class=m-3>
    <div class="card-header py-2 d-flex w-100 justify-content-between"
        class:bg-success={dev_status === 'ok'}
        class:bg-danger={dev_status === 'error'}
    >
        <div title="NFC/RFiD tags">
        NFC
        {dev_status === 'error' ? ' fout apparaat' : ''}
        </div>
        <div>
            <Badge color=info title="Totaal aantaal NFC-tags geregistreerd">
                15
            </Badge>
        </div>
    </div>
    <div class="card-body py-2"
        class:bg-success={nfc_status === 'ok'}
        class:bg-warning={nfc_status === 'not_found'}
        class:bg-danger={nfc_status === 'unvalid'}>
        <CardText class="py-0 mb-0">
            {$nfc_uid ? $nfc_uid : '---'}
        </CardText>



    </div>
    <CardFooter class="d-flex w-100 justify-content-end">
        <Button color=accent title="Activeer deze NFC-tag voor deze persoon" disabled={!can_activate}>
            Activeer
        </Button>
    </CardFooter>
</Card>