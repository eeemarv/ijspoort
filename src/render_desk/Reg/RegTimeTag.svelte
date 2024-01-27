<script>
  import TimeTag from '../../render/Common/TimeTag.svelte';

  export let reg;

</script>

<TimeTag
  ts={reg.ts_epoch}
  color:warning={reg.manual}
  color:accent={reg.gate}
  color:teal={reg.desk && !reg.manual}
  title={reg.manual ? 'tijdstip manuele registratie' : (reg.desk ? 'tijdstip registratie met NFC vanaf desk ' + reg.nfc_uid : 'tijdstip registratie met NFC vanaf poort ' + reg.nfc_uid)}
/>
