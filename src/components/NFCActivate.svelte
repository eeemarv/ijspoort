<script>
    const { ipcRenderer } = window.require('electron');
    import { createEventDispatcher, onMount } from 'svelte';
    import { Button } from 'sveltestrap';
    import { db_nfc } from '../services/db';
    import { person, person_nfc_list } from './../services/store';
    import { nfc_uid, modals } from './../services/store';
    import NFCProgress from './NFCProgress.svelte';

    export let nfc_status;

    const dispatch = createEventDispatcher();

    onMount(() => {
        modals.add('nfc_activate', NFCProgress);
        modals.title('nfc_activate', 'Activeer NFC tag');
    });

    $: can_activate = $person && $nfc_uid && nfc_status === 'transport_key';

    const handle_activate_nfc = () => {
        console.log('handle_activate_nfc');
        modals.open('nfc_activate');
        modals.progress('nfc_activate', 0);
        modals.message('nfc_activate', 'Schrijf sleutels');
        console.log('send nfc.init');
        ipcRenderer.send('nfc.init', $person);
    };

    ipcRenderer.on('nfc.init.ok', (ev, card) => {
        add_nfc();
        modals.open('nfc_activate');
        modals.progress('nfc_activate', 100);
        modals.message('nfc_activate', 'Initialisatie ok.');
        modals.close_after('nfc_activate', 1000);
    });

    ipcRenderer.on('nfc.init.fail', (ev, card) => {
        modals.open('nfc_activate');
        modals.progress('nfc_activate', 20);
        modals.message('nfc_activate', 'Initialisatie niet gelukt.');
        modals.close_after('nfc_activate', 5000);
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
            dispatch('activated', {});
        }).catch((err) => {
            console.log(err);
        });
    };

</script>

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
