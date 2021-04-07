<script>
  import { Badge } from 'sveltestrap';
  import LocaleDateString from '../Common/LocaleDateString.svelte';

  export let nfc;
</script>

<Badge color=success title="toegangsbadge">NFC</Badge>
<Badge color=primary title="unieke code van badge">{nfc.uid}</Badge>
&nbsp;
<LocaleDateString ts={nfc.ts_epoch} title="datum van activatie" />