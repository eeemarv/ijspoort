<script>
  import { Badge } from 'sveltestrap';
  import LocaleDateString from '../Common/LocaleDateString.svelte';

  export let nfc;
</script>

<Badge color=accent title="toegangsbadge">NFC</Badge>
<Badge color=accent title="unieke code van badge">{nfc.uid}</Badge>
&nbsp;
<LocaleDateString ts={nfc.ts_epoch} title="datum van activatie" />