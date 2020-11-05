<script>
    import { Card, CardText } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');

    let dev_on = false;
    let eid;
    let eid_ok = false;
    let eid_unknown = false;
    let eid_error = false;

    ipcRenderer.on('dev.eid.on', (ev) => {
        dev_on = true;
    });

    ipcRenderer.on('dev.eid.off', (ev) => {
        dev_on = false;
    });

    ipcRenderer.on('dev.eid.error', (ev, err) => {
        dev_on = false;
    });

    ipcRenderer.on('eid.wait', (ev) => {
        eid.national_number = 'Lezen ...';
        eid.firstnames = '...';
        eid.surname = '...';
    });

    ipcRenderer.on('eid.unknown', (ev, err) => {
        eid.national_number = 'Onleesbare kaart';
    });

    ipcRenderer.on('eid.on', (ev, card) => {
        eid = card;
        eid_ok = true;

        console.log(eid);
    });

    ipcRenderer.on('eid.off', (ev) => {
        eid = '';
        eid_ok = false;
        eid_unknown = false;
    });

    ipcRenderer.on('eid.error', (ev, err) => {
        eid = err;
        eid_ok = false;
        eid_unknown = false;
        eid_error = true;
    });
</script>

<Card class="text-white border border-white m-3">
    <div class="card-body border-bottom border-white py-2"
        class:bg-on={dev_on}>
        eID
    </div>
    <div class="card-body py-2"
        class:bg-on={eid_ok}
        class:bg-warn={eid_unknown}
        class:bg-err={eid_error}
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