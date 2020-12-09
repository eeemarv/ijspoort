<script>
    import { Badge, Card, CardBody, CardText } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');
    import { eid } from './../services/store';

    let dev_status = 'off';

    let eid_err_msg;
    let dev_err_msg;

    ipcRenderer.on('dev.eid.on', (ev) => {
        dev_status = 'on';
    });
    ipcRenderer.on('dev.eid.off', (ev) => {
        dev_status = 'off';
    });
    ipcRenderer.on('dev.eid.error', (ev, err) => {
        dev_err_msg = err;
    });
    ipcRenderer.on('eid.wait', (ev) => {
        $eid = undefined;
        eid_err_msg = undefined;
    });
    ipcRenderer.on('eid.unknown', (ev, err) => {
        eid_err_msg = err;
    });
    ipcRenderer.on('eid.on', (ev, card) => {
        $eid = card;
    });
    ipcRenderer.on('eid.off', (ev) => {
        $eid = undefined;
    });
    ipcRenderer.on('eid.error', (ev, err) => {
        eid_err_msg = err;
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
    {#if $eid}
        <CardBody class="bg-success py-2">
            <CardText class="py-0 mb-0">
                {$eid.national_number}
            </CardText>
            <CardText class="py-0 mb-0">
                {$eid.firstnames}
            </CardText>
            <CardText class="py-0 mb-0">
                {$eid.surname}
            </CardText>
        </CardBody>
    {:else if eid_err_msg || dev_err_msg}
        <CardBody class="bg-danger py-2">
            <CardText class="py-0 mb-0">
                {eid_err_msg || dev_err_msg}
            </CardText>
        </CardBody>
    {:else}
        <CardBody class="py-2">
            <CardText class="py-0 mb-0">
                ---
            </CardText>
        </CardBody>
    {/if}
</Card>