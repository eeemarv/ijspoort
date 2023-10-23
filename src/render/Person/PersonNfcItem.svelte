<script>
  import { ListGroupItem } from 'sveltestrap';
  import { nfc_uid } from './../services/store';
  import NfcTag from '../Nfc/NfcTag.svelte';

  export let nfc;
</script>

<ListGroupItem active={$nfc_uid === nfc.uid}>
  <NfcTag {nfc} />
</ListGroupItem>