<script>
  import { Badge } from 'sveltestrap';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import { nfc_table } from '../services/store';

  export let nfc_id = undefined;

  $: ts_epoch = $nfc_table[nfc_id].ts_epoch;
  $: uid = $nfc_table[nfc_id].uid;
</script>

<Badge color=accent title="toegangsbadge">NFC</Badge>
<Badge color=accent title="unieke code van badge">{uid}</Badge>
&nbsp;
<LocaleDateString {ts_epoch} title="datum van activatie" />