<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { Badge, Card, CardFooter, CardText, CustomInput } from 'sveltestrap';
    import { Button } from 'sveltestrap';
    import { setTimeout } from 'timers';
    const { ipcRenderer } = window.require('electron');
    import { db_nfc, db_person } from './../services/pouchdb';
    import { nfc_uid, person, person_nfc_list, gate_keeper } from './../services/store';
    import NfcTestModal from './NFCTestModal.svelte';
    import NFCWriteModal from './NFCWriteModal.svelte';

    const dispatch = createEventDispatcher();

    let dev_status = 'off';
    let nfc_status = 'off';
    let nfc_count_total = 0;
    let quick_scan_reg = true;

    let write_modal_open = false;
    let write_modal_progress = 0;
    let write_modal_color = 'primary';
    let write_modal_message;

    let test_modal_open = false;
    let test_modal_progress = 0;
    let test_modal_color = 'primary';
    let test_modal_message;

    $: can_activate = $person && $nfc_uid && nfc_status === 'transport_key';

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
        db_nfc.get('uid_'+ card.uid).then((res) => {
            console.log(res);
            nfc_status = 'ok';
            return res.person_id;
        }).catch((err) => {
            if (err.name === 'not_found'){
                ipcRenderer.send('nfc.test_transport_key');
                throw 'nfc uid not found in database (check if transport key is set)';
            }
            throw err;
        }).then((res) => {
            return db_person.get(res);
        }).then((res) => {
            if (quick_scan_reg){
                console.log('register_by_nfc event');
                dispatch('register_by_nfc', {
                    person: res
                });
                return;
            }
            $person = res;
        }).catch((err) => {
            console.log(err);
            if (err.name === 'not_found'){
                nfc_status = 'not_found';
            }
        });
    });

    /******/

    ipcRenderer.on('nfc.test_transport_key.ok', (ev, card) => {
        console.log('nfc.test_transport_key.ok', card);
        nfc_status = 'transport_key';
    });
    ipcRenderer.on('nfc.test_transport_key.fail', (ev, card) => {
        console.log('nfc.test_transport_key.fail', card);
        nfc_status = 'not_found';
    });
    ipcRenderer.on('nfc.test_a_key.ok', (ev) => {
        console.log('A key OK');
    });
    ipcRenderer.on('nfc.test_a_key.fail', (ev) => {
        console.log('A key FAIL');
    });
    ipcRenderer.on('nfc.test_b_key.ok', (ev) => {
        console.log('B key OK');
    });
    ipcRenderer.on('nfc.test_b_key.fail', (ev) => {
        console.log('B key FAIL');
    });

    /*** READ TEST *****/
    const handle_test_nfc = () => {
        console.log('handle_test_nfc');
        test_modal_open = true;
        test_modal_progress = 0;
        ipcRenderer.send('nfc.read.member_id');
    };
    ipcRenderer.on('nfc.read.member_id.ok', (event, card, str) => {
        console.log('str', str);
        console.log('card', card);
        test_modal_progress = 100;
        test_modal_message = 'Data ' + str;
        test_modal_color='success';
        setTimeout(() => {
            test_modal_open = false;
        }, 2000);
    });
    ipcRenderer.on('nfc.read.member_id.fail', (event, card, str) => {
        test_modal_message = 'Lees test niet geslaagd';
        test_modal_color='danger';
    });

    /** INIT ***/
    const handle_activate_nfc = () => {
        console.log('handle_activate_nfc');
        write_modal_open = true;
        write_modal_progress = 0;
        write_modal_message = 'Initialiseer: schrijf sleutels';
        console.log('send nfc.init');
        ipcRenderer.send('nfc.init', $person);
    };

    ipcRenderer.on('nfc.init.ok', (ev, card) => {
        add_nfc();
        write_modal_message = 'Iinitialisatie ok.';
        write_modal_progress = 100;
        setTimeout(() => {
            write_modal_open = false;
        }, 100);
    });
    ipcRenderer.on('nfc.init.fail', (ev, card) => {
        write_modal_message = 'Initialisering niet gelukt';
        write_modal_progress = 20;
        write_modal_color='danger';
    });

    /****/

    ipcRenderer.on('nfc.off', (ev) => {
        $nfc_uid = undefined;
        nfc_status = 'off';
    });

    const add_nfc = () => {
        let now = new Date();
        let nfc = {
            _id: 'uid_' + $nfc_uid,
            ts_epoch: now.getTime(),
            uid: $nfc_uid,
            person: $person,
            person_id: $person._id,
            gate_keeper: $gate_keeper,
            gate_keeper_id: $gate_keeper?._id
        };

        db_nfc.put(nfc).then((res) => {
            console.log('add_nfc');
            console.log(res);
            nfc_status = 'ok';
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

<NFCWriteModal
    is_open={write_modal_open}
    progress={write_modal_progress}
    message={write_modal_message}
    color={write_modal_color}
/>
<NfcTestModal
    is_open={test_modal_open}
    progress={test_modal_progress}
    message={test_modal_message}
    color={test_modal_color}
/>

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
        class:bg-info={nfc_status === 'transport_key'}
        class:bg-danger={nfc_status === 'unvalid'}>
        <CardText class="py-0 mb-0">
            {$nfc_uid ? $nfc_uid : '---'}
        </CardText>
        {#if nfc_status === 'not_found'}
            <CardText>
                NIET GEVONDEN
            </CardText>
        {:else if nfc_status === 'transport_key'}
            <CardText>
                LEEG: activeerbaar
            </CardText>
        {:else if nfc_status === 'unvalid'}
            <CardText>
                LEESFOUT: tag ongeldig
            </CardText>
        {/if}
    </div>
    <CardFooter class="d-flex w-100 justify-content-end">
        <Button
            color={$person_nfc_list.length > 0 ? 'danger' : 'success'}
            title="Activeer deze NFC-tag voor deze persoon"
            disabled={!can_activate}
            on:click={handle_activate_nfc}>
            Activeer
            {#if $person_nfc_list.length > 0}
                extra tag
            {/if}
        </Button>
    </CardFooter>
</Card>