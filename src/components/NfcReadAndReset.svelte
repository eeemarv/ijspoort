<script>
    const env = window.require('electron').remote.process.env;
    import { CardFooter } from 'sveltestrap';
    import { nfc_uid, nfc_auto_reg } from '../services/store';
    import NFCReadTest from './NfcReadTest.svelte';
    import NFCReset from './NfcReset.svelte';

    const nfc_reset_writable_enabled = env.NFC_RESET_WRITABLE_ENABLED === '1';
    const nfc_reset_enabled = env.NFC_RESET_ENABLED === '1';

    export let nfc_status;
</script>

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
