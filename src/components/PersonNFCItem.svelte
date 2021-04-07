<script>
  import { ListGroupItem, Badge } from 'sveltestrap';
  import { nfc_uid } from './../services/store';
  import NfcTag from './NfcTag.svelte';

  export let nfc;
</script>

<ListGroupItem active={$nfc_uid === nfc.uid}>
  <NfcTag {nfc} />
</ListGroupItem>