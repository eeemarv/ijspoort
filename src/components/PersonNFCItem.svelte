<script>
  import { onMount } from 'svelte';
  import { ListGroupItem, Badge } from 'sveltestrap';

  export let nfc;

  let ts_date = new Date(nfc.ts_epoch);

</script>

<ListGroupItem>
  <Badge color=success title="toegangsbadge">NFC</Badge>
  <Badge color=primary title="unieke code van badge">{nfc.uid}</Badge>
  &nbsp;
  <span title="datum van activatie">
    {ts_date.toLocaleDateString('nl-BE', {month: 'short', year: 'numeric', day:'numeric'})}
  </span>

</ListGroupItem>