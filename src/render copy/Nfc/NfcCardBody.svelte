<script>
  import { CardText } from 'sveltestrap';
  import { e_nfc } from '../../services/enum';

  export let nfc_status;
  export let nfc_uid;
</script>

<div class="card-body py-2"
  class:bg-success={nfc_status === e_nfc.OK}
  class:bg-warning={nfc_status === e_nfc.WRITABLE}
  class:bg-info={nfc_status === e_nfc.TRANSPORT_KEY}
  class:bg-danger={nfc_status === e_nfc.NOT_WRITABLE}>
  <CardText class="py-0 mb-0">
    {nfc_uid ? nfc_uid : '---'}
  </CardText>
  {#if nfc_status === e_nfc.WRITABLE}
    <CardText>
      NIET GEVONDEN: mogelijke synchronisatie fout
    </CardText>
  {:else if nfc_status === e_nfc.TRANSPORT_KEY}
    <CardText>
      LEEG: activeerbaar
    </CardText>
  {:else if nfc_status === e_nfc.NOT_WRITABLE}
    <CardText>
      NIET LEESBAAR: ongeldige sleutel
    </CardText>
  {/if}
</div>
