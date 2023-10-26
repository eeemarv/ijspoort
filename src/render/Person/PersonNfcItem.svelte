<script>
  import { ListGroupItem } from 'sveltestrap';
  import NfcTag from '../Nfc/NfcTag.svelte';
  import { selected_nfc_id } from './../services/store';

  export let nfc_id;
</script>

<ListGroupItem active={$selected_nfc_id === nfc_id}>
  <NfcTag {nfc_id} />
</ListGroupItem>