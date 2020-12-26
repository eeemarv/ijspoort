<script>
    import { Badge, Card, CardBody, CardText } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');
    import { onMount } from 'svelte';
    import { db_eid } from '../services/db';
    import { eid } from './../services/store';
    import { person } from './../services/store';

    let dev_status = 'off';
    let eid_count_total = 0;

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

    const add_eid = (card, person) => {
        let now = new Date();
        let eid = {
            _id: 'c' + card.cardnumber,
            ts_epoch: now.getTime(),
            card: card,
            person_id: person._id
        };

        db_eid.put(eid).then((res) => {
            console.log('add_nfc');
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    };

    const update_eid_count_total = () => {
        db_eid.query('search/count_total', {
            key: true,
            reduce: true,
            group: true
        }).then((res) => {
            console.log(res);
            if (res.rows.length > 0){
                eid_count_total = res.rows[0].value;
            } else {
                eid_count_total = 0;
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    onMount(() => {
        update_eid_count_total();
    });

    db_eid.changes({
        since: 'now',
        live: true
    }).on('change', (change) => {
        console.log('eid changes (EID component)');
        console.log(change);
        update_eid_count_total();
    }).on('error', (err) => {
        console.log(err);
    });
</script>

<Card class=m-3>
    <div class="card-header py-2 d-flex w-100 justify-content-between"
        class:bg-success={dev_status === 'on'}>
        <div>eID</div>
        <div>
            <Badge color=info title="Totaal aantal eIDs geregistreerd">
                {eid_count_total}
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