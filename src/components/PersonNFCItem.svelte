<script>
  import { ListGroupItem, Badge } from 'sveltestrap';
  import { nfc_uid } from './../services/store';

  export let nfc;

  let ts_date = new Date(nfc.ts_epoch);

</script>

<ListGroupItem active={$nfc_uid === nfc.uid}>
  <Badge color=success title="toegangsbadge">NFC</Badge>
  <Badge color=primary title="unieke code van badge">{nfc.uid}</Badge>
  &nbsp;
  <span title="datum van activatie">
    {ts_date.toLocaleDateString('nl-BE', {month: 'short', year: 'numeric', day:'numeric'})}
  </span>

</ListGroupItem>