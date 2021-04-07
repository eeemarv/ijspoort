<script>
    const { ipcRenderer } = window.require('electron');
    import { createEventDispatcher } from 'svelte';
    import { db_nfc, db_person } from '../services/db';
    import { person } from '../services/store';
    import { nfc_uid, nfc_auto_reg } from '../services/store';

    const dispatch = createEventDispatcher();

    export let nfc_status = 'off';

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
