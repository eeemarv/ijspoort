<script>
    const env = window.require('electron').remote.process.env;
    const { ipcRenderer } = window.require('electron');
    import { createEventDispatcher, onMount } from 'svelte';
    import { Badge, Card, CardFooter, CardText, CustomInput, Progress } from 'sveltestrap';
    import { Button } from 'sveltestrap';
    import { Modal, ModalHeader, ModalBody, ModalFooter } from 'sveltestrap';
    import { setTimeout } from 'timers';
    import { db_nfc, db_person } from './../services/pouchdb';
    import { person, person_nfc_list, gate_keeper } from './../services/store';
    import { nfc_uid, nfc_auto_reg } from './../services/store';

    const nfc_reset_writable_enabled = env.NFC_RESET_WRITABLE_ENABLED === '1';
    const nfc_reset_enabled = env.NFC_RESET_ENABLED === '1';

    const dispatch = createEventDispatcher();

    let dev_status = 'off';
    let nfc_status = 'off';
    let nfc_count_total = 0;

    let modal_open = false;
    let modal_title = '';
    let modal_message = '';
    let modal_progress = 0;
    const modal_toggle = () => {
        modal_open = !modal_open;
        modal_pogress = 0;
    };

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
            if ($nfc_auto_reg){
                console.log('register_by_nfc event');
                dispatch('register_by_nfc', {
                    person: res
                });
                return;
            }
            $person = res;
        }).catch((err) => {
            console.log(err);
            console.log('person linked to this nfc not found');
            if (err.name === 'not_found'){
                ipcRenderer.send('nfc.test_transport_key');
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
        console.log('test for B key, nfc.test_b_key');
        ipcRenderer.send('nfc.test_b_key');
    });
    ipcRenderer.on('nfc.test_a_key.ok', (ev) => {
        console.log('A key OK');
    });
    ipcRenderer.on('nfc.test_a_key.fail', (ev) => {
        console.log('A key FAIL');
    });
    ipcRenderer.on('nfc.test_b_key.ok', (ev) => {
        console.log('nfc.test_b_key.ok');
        nfc_status = 'writable';
    });
    ipcRenderer.on('nfc.test_b_key.fail', (ev) => {
        console.log('nfc.test_b_key.fail');
        nfc_status = 'not_writable';
    });

    /*** READ TEST *****/
    const handle_nfc_read = (ev) => {
        console.log('handle_nfc_read');
        modal_open = true;
        modal_progress = 0;
        modal_title = 'Lees tag';
        ipcRenderer.send('nfc.read');
    };
    ipcRenderer.on('nfc.read.ok', (event, card, date_of_birth, member_id) => {
        console.log('nfc.read.ok');
        console.log('date_of_birth', date_of_birth);
        console.log('member_id', member_id);
        modal_open = true;
        modal_progress = 100;
        modal_title = 'Lees tag';
        modal_message = date_of_birth + ' ' + member_id;
    });
    ipcRenderer.on('nfc.read.fail', (event, card, str) => {
        test_modal_message = 'Lees test niet geslaagd';
    });

    /** INIT ***/
    const handle_activate_nfc = () => {
        console.log('handle_activate_nfc');
        modal_open = true;
        modal_progress = 0;
        modal_title = 'Activeer NFC tag';
        modal_message = 'Schrijf sleutels';
        console.log('send nfc.init');
        ipcRenderer.send('nfc.init', $person);
    };

    ipcRenderer.on('nfc.init.ok', (ev, card) => {
        add_nfc();
        modal_open = true;
        modal_title = 'Activeer NFC tag';
        modal_message = 'Iinitialisatie ok.';
        modal_progress = 100;
        setTimeout(() => {
            modal_open = false;
        }, 300);
    });
    ipcRenderer.on('nfc.init.fail', (ev, card) => {
        modal_open = true;
        modal_title = 'Activeer NFC tag';
        modal_message = 'Initialisering niet gelukt';
        modal_progress = 20;
        setTimeout(() => {
            modal_open = false;
        }, 5000);
    });

    /**** RESET ****/

    const handle_nfc_reset = () => {
        modal_title = 'Wis NFC tag';
        modal_message = 'Wis uit database';
        modal_progress = 0;
        modal_open = true;
        console.log($nfc_uid);
        db_nfc.get('uid_' + $nfc_uid).catch((err) => {
            console.log(err);
            if (err.name === 'not_found'){
                return 'not_found';
            }
            throw err;
        }).then((doc) => {
            if (doc === 'not_found'){
                return 'not_from_database';
            }
            return db_nfc.remove(doc);
        }).then((res) => {
            console.log(res);
            console.log('nfc.reset', $nfc_uid);
            modal_progress = 50;
            if (res === 'not_from_database'){
                modal_message = 'Tag was niet aanwezig in database.';
            } else {
                modal_message = 'Tag gewist uit database';
            }
            ipcRenderer.send('nfc.reset');
        }).catch((err) => {
            console.log(err);
            modal_title = 'Wis NFC tag';
            modal_message = 'Fout: ' + err;
            modal_progress = 0;
            modal_open = true;
        });
    };
    ipcRenderer.on('nfc.reset.ok', (ev, card) => {
        modal_open = true;
        modal_title = 'Wis NFC tag';
        modal_message = 'Wissen voltooid, test transport sleutel';
        modal_progress = 100;
        setTimeout(() => {modal_open = false}, 1000);
        ipcRenderer.send('nfc.test_transport_key');
        console.log('nfc.reset.ok');
    });
    ipcRenderer.on('nfc.reset.fail', (ev, card) => {
        console.log('nfc.reset.fail');
    });

    /*******/

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
            console.log(res);
            if (res.rows.length > 0){
                nfc_count_total = res.rows[0].value;
            } else {
                nfc_count_total = 0;
            }
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

<Modal isOpen={modal_open} toggle={modal_toggle}>
    <ModalHeader>
        {modal_title}
    </ModalHeader>
    <ModalBody>
        <Progress value={modal_progress} color=light/>
        {modal_message}
    </ModalBody>
    <ModalFooter>
        <Button color=secondary on:click={modal_toggle}>
            Sluiten
        </Button>
    </ModalFooter>
</Modal>

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
        class:bg-warning={nfc_status === 'writable'}
        class:bg-info={nfc_status === 'transport_key'}
        class:bg-danger={nfc_status === 'not_writable'}>
        <CardText class="py-0 mb-0">
            {$nfc_uid ? $nfc_uid : '---'}
        </CardText>
        {#if nfc_status === 'writable'}
            <CardText>
                NIET GEVONDEN: mogelijke synchronisatie fout
            </CardText>
        {:else if nfc_status === 'transport_key'}
            <CardText>
                LEEG: activeerbaar
            </CardText>
        {:else if nfc_status === 'not_writable'}
            <CardText>
                NIET LEESBAAR: ongeldige sleutel
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
    <CardFooter>
        <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="nfc_auto_reg" bind:checked={$nfc_auto_reg}>
            <label class="custom-control-label" for="nfc_auto_reg" title="Registreer automatisch wanneer NFC tag gescand wordt. Vink af voor andere handelingen.">
                Automatische registratie
            </label>
        </div>
    </CardFooter>
    {#if !$nfc_auto_reg  && $nfc_uid && (nfc_status === 'writable' || nfc_status === 'ok')}
    <CardFooter>
        <div class="d-flex w-100 justify-content-between">
            <Button color=info on:click={handle_nfc_read}>
                Lees
            </Button>
            {#if nfc_reset_enabled}
                {#if nfc_status === 'ok' || (nfc_status === 'writable' && nfc_reset_writable_enabled)}
                <Button color=danger on:click={handle_nfc_reset}>
                    Wis
                </Button>
                {/if}
            {/if}
        </div>
    </CardFooter>
    {/if}
</Card>