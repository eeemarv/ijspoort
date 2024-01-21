<script>
  import TimeTag from '../../render/Common/TimeTag.svelte';

  export let reg;
</script>

<TimeTag
  ts={reg.ts_epoch}
  color={reg.manual ? 'warning' : 'accent'}
  title={reg.manual ? 'tijdstip manuele registratie' : 'tijdstip registratie met NFC ' + reg.nfc_uid}
/>
