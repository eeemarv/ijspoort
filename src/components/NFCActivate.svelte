<script>
    const { ipcRenderer } = window.require('electron');
    import { Button } from 'sveltestrap';
    import { setTimeout } from 'timers';
    import { db_nfc } from '../services/db';
    import { person, person_nfc_list } from './../services/store';
    import { nfc_uid } from './../services/store';
    import NfcModal from './NFCModal.svelte';

    export let nfc_status;

    let open = false;
    let message = '';
    let progress = 0;

    $: can_activate = $person && $nfc_uid && nfc_status === 'transport_key';

    const handle_activate_nfc = () => {
        console.log('handle_activate_nfc');
        open = true;
        progress = 0;
        message = 'Schrijf sleutels';
        console.log('send nfc.init');
        ipcRenderer.send('nfc.init', $person);
    };

    ipcRenderer.on('nfc.init.ok', (ev, card) => {
        add_nfc();
        open = true;
        message = 'Iinitialisatie ok.';
        progress = 100;
        setTimeout(() => {
            open = false;
        }, 300);
    });
    ipcRenderer.on('nfc.init.fail', (ev, card) => {
        open = true;
        message = 'Initialisering niet gelukt';
        progress = 20;
        setTimeout(() => {
            open = false;
        }, 5000);
    });

    const add_nfc = () => {
        let now = new Date();
        let nfc = {
            _id: 'uid_' + $nfc_uid,
            ts_epoch: now.getTime(),
            uid: $nfc_uid,
            person_id: $person._id,
        };

        db_nfc.put(nfc).then((res) => {
            console.log('add_nfc');
            console.log(res);
            nfc_status = 'ok';
        }).catch((err) => {
            console.log(err);
        });
    };

</script>

<NfcModal title="Activeer NFC tag" {progress} {open} {message} />

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
