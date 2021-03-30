<script>
    import { Card } from 'sveltestrap';
    import NFCActivate from './NFCActivate.svelte';
    import NFCAutoReg from './NFCAutoReg.svelte';
    import NFCDeviceCardHeading from './NFCDeviceCardHeading.svelte';
    import NFCCardBody from './NFCCardBody.svelte';
    import NFCReadAndReset from './NFCReadAndReset.svelte';
    import NFCScan from './NFCScan.svelte';

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
