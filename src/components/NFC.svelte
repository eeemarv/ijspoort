<script>
    import { onMount } from 'svelte';
    import { Badge, Card, CardFooter, CardText } from 'sveltestrap';
    import { Button } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');
    import { db_nfc } from './../services/pouchdb';
    import { nfc_uid, person, gate_keeper } from './../services/store';

    let dev_status = 'off';
    let nfc_status = 'off';
    let nfc_count_total = 0;

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
        db_nfc.get('c'+ card.uid).then((res) => {
            console.log(res);
            nfc_status = 'ok';
        }).catch((err) => {
            console.log(err);
            if (err.name === 'not_found'){
                nfc_status = 'not_found';
            }

        });
    });

    ipcRenderer.on('nfc.off', (ev) => {
        $nfc_uid = undefined;
        nfc_status = 'off';
    });



    const add_nfc = (person, uid) => {
        let now = new Date();
        let nfc = {
            _id: 'c' + uid,
            ts_epoch: now.getTime(),
            uid: uid,
            person: person,
            person_id: person._id,
            gate_keeper: $gate_keeper,
            gate_keeper_id: $gate_keeper?._id
        };

        db_nfc.put(nfc).then((res) => {
            console.log('add_nfc');
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    };

    const update_nfc_count_total = () => {
        db_nfc.query('search/count_total', {
            key: true,
            reduce: true,
            group: true
        }).then((res) => {
            console.log(res)
            nfc_count_total = res.rows[0].value;
        }).catch((err) => {
            console.log(err);
        });
    };

    onMount(() => {
        update_nfc_count_total();
    });

    db_nfc.changes({
        since: 'now',
        live: true
    }).on('change', (change) => {
        console.log('nfc changes (NFC component)');
        console.log(change);
        update_nfc_count_total();
    }).on('error', (err) => {
        console.log(err);
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
                {nfc_count_total}
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
        {#if nfc_status === 'not_found'}
            <CardText>
                NIET GEVONDEN
            </CardText>
        {/if}
    </div>
    <CardFooter class="d-flex w-100 justify-content-end">
        <Button color=accent title="Activeer deze NFC-tag voor deze persoon" disabled={!can_activate}>
            Activeer
        </Button>
    </CardFooter>
</Card>