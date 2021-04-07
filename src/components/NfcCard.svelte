<script>
    import { Card } from 'sveltestrap';
    import NFCActivate from './NfcActivate.svelte';
    import NFCAutoReg from './NfcAutoReg.svelte';
    import NFCDeviceCardHeading from './NfcDeviceCardHeading.svelte';
    import NFCCardBody from './NfcCardBody.svelte';
    import NFCReadAndReset from './NfcReadAndReset.svelte';
    import NFCScan from './NfcScan.svelte';

    let nfc_status;
</script>

<NFCScan bind:nfc_status on:register />

<Card class=m-3>
    <NFCDeviceCardHeading />
    <NFCCardBody {nfc_status} />
    <NFCActivate {nfc_status} on:activated={() => { nfc_status = 'ok'; }} />
    <NFCAutoReg />
    <NFCReadAndReset {nfc_status} />
</Card>
