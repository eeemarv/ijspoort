<script>
  import TimeTag from './TimeTag.svelte';

  export let reg;
</script>

<TimeTag ts={reg.ts_epoch} color={reg.manual ? 'warning' : 'primary'} title={reg.manual ? 'tijdstip manuele registratie' : 'tijdstip registratie met NFC ' + reg.nfc_uid} />
