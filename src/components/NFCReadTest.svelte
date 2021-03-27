<script>
    const { ipcRenderer } = window.require('electron');
    import { onMount } from 'svelte';
    import { Button } from 'sveltestrap';
    import { modals } from '../services/store';
    import NFCProgress from './NFCProgress.svelte';

    onMount(() => {
        modals.add('nfc_read_test', NFCProgress);
        modals.title('nfc_read_test', 'Lees NFC tag');
    });

    const handle_nfc_read = (ev) => {
        console.log('handle_nfc_read');
        modals.open('nfc_read_test');
        modals.progress('nfc_read_test', 0);
        ipcRenderer.send('nfc.read');
    };

    ipcRenderer.on('nfc.read.ok', (event, card, date_of_birth, member_id) => {
        console.log('nfc.read.ok');
        console.log('date_of_birth', date_of_birth);
        console.log('member_id', member_id);
        modals.open('nfc_read_test');
        modals.progress('nfc_read_test', 100);
        modals.message('nfc_read_test', date_of_birth + ' ' + member_id);
    });

    ipcRenderer.on('nfc.read.fail', (event, card, str) => {
        modals.open('nfc_read_test');
        modals.progress('nfc_read_test', 50);
        modals.message('nfc_read_test', 'Lees test niet geslaagd.');
    });
</script>

<Button color=info
    title="Lees inhoud van NFC tag"
    on:click={handle_nfc_read}
>
    Lees
</Button>
