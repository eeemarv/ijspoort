<script>
  import { CardText } from 'sveltestrap';
  import { nfc_uid } from '../services/store';

  export let nfc_status;
</script>

<div class="card-body py-2"
  class:bg-success={nfc_status === 'ok'}
  class:bg-warning={nfc_status === 'writable'}
  class:bg-info={nfc_status === 'transport_key'}
  class:bg-danger={nfc_status === 'not_writable'}>
  <CardText class="py-0 mb-0">
    {$nfc_uid ? $nfc_uid : '---'}
  </CardText>
  {#if nfc_status === 'writable'}
    <CardText>
      NIET GEVONDEN: mogelijke synchronisatie fout
    </CardText>
  {:else if nfc_status === 'transport_key'}
    <CardText>
      LEEG: activeerbaar
    </CardText>
  {:else if nfc_status === 'not_writable'}
    <CardText>
      NIET LEESBAAR: ongeldige sleutel
    </CardText>
  {/if}
</div>
