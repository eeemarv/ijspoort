<script>
    import { Badge, Card, CardText } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');

    let dev_status = 'off';
    let eid_status = 'off';
    let eid;

    ipcRenderer.on('dev.eid.on', (ev) => {
        dev_status = 'on';
    });
    ipcRenderer.on('dev.eid.off', (ev) => {
        dev_status = 'off';
    });
    ipcRenderer.on('dev.eid.error', (ev, err) => {
        dev_status = 'error';
    });

    ipcRenderer.on('eid.wait', (ev) => {
        eid_status = 'wait';
        eid.national_number = 'Lezen ...';
    });

    ipcRenderer.on('eid.unknown', (ev, err) => {
        eid_status = 'unknown';
        eid.national_number = 'Onleesbare kaart';
    });

    ipcRenderer.on('eid.on', (ev, card) => {
        eid_status = 'ok';
    });

    ipcRenderer.on('eid.off', (ev) => {
        eid_status = 'off';
    });

    ipcRenderer.on('eid.error', (ev, err) => {
        eid_status = 'error';
        eid = err;
    });
</script>

<Card class=m-3>
    <div class="card-header py-2 d-flex w-100 justify-content-between"
        class:bg-success={dev_status === 'on'}>
        <div>eiD</div>
        <div>
            <Badge color=info title="Totaal aantal eIDs geregistreerd">
                15
            </Badge>
        </div>
    </div>
    <div class="card-body py-2"
        class:bg-success={eid_status === 'ok'}
        class:bg-warning={(eid_status === 'wait') || (eid_status = 'unknwon')}
        class:bg-danger={eid_status === 'error'}
    >
        <CardText class="py-0 mb-0">
            { eid ? eid.national_number : '---' }
        </CardText>
        <CardText class="py-0 mb-0">
            { eid ? eid.firstnames : '---' }
        </CardText>
        <CardText class="py-0 mb-0">
            { eid ? eid.surname : '---' }
        </CardText>
    </div>
</Card>