<script>
  import TimeTag from '../../render/Common/TimeTag.svelte';

  export let reg;

</script>

<TimeTag
  ts={reg.ts_epoch}
  color={reg.manual ? 'warning' : (reg.desk ? 'primary' : 'accent')}
  title={reg.manual ? 'tijdstip manuele registratie' : (reg.desk ? 'tijdstip registratie met NFC vanaf desk ' + reg.nfc_uid : 'tijdstip registratie met NFC vanaf poort ' + reg.nfc_uid)}
/>
