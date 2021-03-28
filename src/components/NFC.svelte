<script>
    const env = window.require('electron').remote.process.env;
    const { ipcRenderer } = window.require('electron');
    import { createEventDispatcher } from 'svelte';
    import { Card, CardFooter, CardText } from 'sveltestrap';
    import { db_nfc, db_person } from '../services/db';
    import { person } from './../services/store';
    import { nfc_uid, nfc_auto_reg } from './../services/store';
    import NFCActivate from './NFCActivate.svelte';
    import NFCDevice from './NFCDevice.svelte';
    import NFCReadTest from './NFCReadTest.svelte';
    import NFCReset from './NFCReset.svelte';

    const nfc_reset_writable_enabled = env.NFC_RESET_WRITABLE_ENABLED === '1';
    const nfc_reset_enabled = env.NFC_RESET_ENABLED === '1';

    const dispatch = createEventDispatcher();

    let nfc_status = 'off';

    ipcRenderer.on('nfc.on', (ev, card) => {
        $nfc_uid = card.uid;
        let year_key = 'y' + new Date().getFullYear().toString();

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
        }).catch((err) => {
            console.log(err);
            if (err.name === 'not_found'){
                console.log('person linked to this nfc not found');
                ipcRenderer.send('nfc.test_transport_key');
                throw 'person was not found';
            }
            throw err;
        }).then((res) => {
            let is_member = false;
            if (res.member_year !== undefined && res.member_year[year_key]){
                is_member = true;
            }
            if ($nfc_auto_reg && is_member){
                console.log('register_by_nfc event');
                dispatch('register', {
                    person: res
                });
                return;
            }
            $person = res;
        }).catch((err) => {
            console.log(err);
            if (err.name === 'not_found'){
                $person = res;
            }
        });

        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
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

    /*******/

    ipcRenderer.on('nfc.off', (ev) => {
        $nfc_uid = undefined;
        nfc_status = 'off';
    });
</script>

<Card class=m-3>
    <NFCDevice />
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
        <NFCActivate {nfc_status} on:activated={() => { nfc_status = 'ok'; }} />
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
                <NFCReadTest />
                {#if nfc_reset_enabled}
                    {#if nfc_status === 'ok' || (nfc_status === 'writable' && nfc_reset_writable_enabled)}
                        <NFCReset />
                    {/if}
                {/if}
            </div>
        </CardFooter>
    {/if}
</Card>
