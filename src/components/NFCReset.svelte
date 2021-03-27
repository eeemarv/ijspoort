<script>
    const { ipcRenderer } = window.require('electron');
    import { onMount } from 'svelte';
    import { Button } from 'sveltestrap';
    import { db_nfc } from '../services/db';
    import { nfc_uid, modals } from './../services/store';
    import NfcProgress from './NFCProgress.svelte';

    onMount(() => {
        modals.add('nfc_reset', NfcProgress);
        modals.title('nfc_reset', 'Wis NFC tag');
    });

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

    /**** RESET ****/

    const handle_nfc_reset = () => {
        modals.open('nfc_reset');
        modals.message('nfc_reset', 'Wis uit database');
        modals.progress('nfc_reset', 0);
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
            modals.progress('nfc_reset', 50)
            if (res === 'not_from_database'){
                modals.message('nfc_reset', 'Tag was niet aanwezig in database.');
            } else {
                modals.message('nfc_reset', 'Tag gewist uit database');
            }
            ipcRenderer.send('nfc.reset');
        }).catch((err) => {
            console.log(err);
            modals.message('nfc_reset', 'Fout: ' + err);
            modals.progress('nfc_reset', 0);
            modals.open('nfc_reset');
        });
    };

    ipcRenderer.on('nfc.reset.ok', (ev, card) => {
        modals.message('nfc_reset', 'Wissen voltooid, test transport sleutel');
        modals.progress('nfc_reset', 100);
        modals.open('nfc_reset');
        modals.close_after('nfc_reset', 1000);
        ipcRenderer.send('nfc.test_transport_key');
        console.log('nfc.reset.ok');
    });

    ipcRenderer.on('nfc.reset.fail', (ev, card) => {
        modals.message('nfc_reset', 'Gewist uit database, doch fout bij wissen NFC tag.');
        modals.progress('nfc_reset', 50);
        modals.open('nfc_reset');
        console.log('nfc.reset.fail');
    });

</script>

<Button color=danger on:click={handle_nfc_reset} title="Wis deze NFC tag">
    Wis
</Button>
