<script>
    const { ipcRenderer } = window.require('electron');
    import { Button } from 'sveltestrap';
    import NFCModal from './NFCModal.svelte';

    let open = false;
    let message = '';
    let progress = 0;

    const handle_nfc_read = (ev) => {
        console.log('handle_nfc_read');
        open = true;
        progress = 0;
        ipcRenderer.send('nfc.read');
    };

    ipcRenderer.on('nfc.read.ok', (event, card, date_of_birth, member_id) => {
        console.log('nfc.read.ok____');
        console.log('date_of_birth', date_of_birth);
        console.log('member_id', member_id);
        open = true;
        progress = 100;
        message = date_of_birth + ' ' + member_id;
    });

    ipcRenderer.on('nfc.read.fail', (event, card, str) => {
        open = true;
        progress = 50;
        message = 'Lees test niet geslaagd';
    });
</script>

<NFCModal title="Lees NFC tag" {message} {progress} {open} />

<Button color=info
    title="Lees inhoud van NFC tag"
    on:click={handle_nfc_read}
>
    Lees
</Button>
