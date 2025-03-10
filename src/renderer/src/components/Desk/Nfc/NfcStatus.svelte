<script>
  import { CardText } from 'sveltestrap';
  import { en_nfc_status } from '../../../services/enum';
  import { nfc_id_to_uid } from '../../../nfc/nfc_id';

  export let nfc_status;
  export let nfc_id;
</script>

<div class="list-group-item"
  class:bg-success={nfc_status === en_nfc_status.FOUND}
  class:bg-warning={nfc_status === en_nfc_status.WRITABLE}
  class:bg-info={nfc_status === en_nfc_status.TRANSPORT_KEY_OK}
  class:bg-danger={nfc_status === en_nfc_status.NOT_WRITABLE}>
  <CardText class="py-0 mb-0">
    {nfc_id ? nfc_id_to_uid(nfc_id) : '---'}
  </CardText>
  {#if nfc_status === en_nfc_status.WRITABLE}
    <CardText>
      NIET GEVONDEN: mogelijke synchronisatie fout
    </CardText>
  {:else if nfc_status === en_nfc_status.TRANSPORT_KEY_OK}
    <CardText>
      LEEG: activeerbaar
    </CardText>
  {:else if nfc_status === en_nfc_status.NOT_WRITABLE}
    <CardText>
      NIET LEESBAAR: ongeldige sleutel
    </CardText>
  {/if}
</div>
