<script>
  import { ListGroupItem, Badge } from 'sveltestrap';
  import { nfc_uid } from './../services/store';
  import LocaleDateString from './LocaleDateString.svelte';

  export let nfc;

</script>

<ListGroupItem active={$nfc_uid === nfc.uid}>
  <Badge color=success title="toegangsbadge">NFC</Badge>
  <Badge color=primary title="unieke code van badge">{nfc.uid}</Badge>
  &nbsp;
  <LocaleDateString ts={nfc.ts_epoch} title="datum van activatie" />
</ListGroupItem>