<script>
  import { desk_nfc_auto_reg_enabled } from '../../../services/store';
  import { desk_nfc_read_test_button_enabled } from '../../../services/store';
  import { desk_nfc_clear_button_enabled } from '../../../services/store';
  import { en_nfc_status } from '../../../services/enum';
  import { Button } from '@sveltestrap/sveltestrap';
  import NfcReadTestModal from './NfcReadTestModal.svelte';
  import NfcClearModal from './NfcClearModal.svelte';

  export let nfc_status;
  export let nfc_id;

  let handle_nfc_clear = () => {};
  let handle_nfc_read_test = () => {};

</script>

<NfcReadTestModal {nfc_id} bind:handle_nfc_read_test />
<NfcClearModal {nfc_id} bind:handle_nfc_clear />

{#if !$desk_nfc_auto_reg_enabled
  && nfc_id
  && (nfc_status === en_nfc_status.WRITABLE || nfc_status === en_nfc_status.FOUND)
  && (($desk_nfc_clear_button_enabled
    && nfc_status === en_nfc_status.FOUND)
    || $desk_nfc_read_test_button_enabled)
}
  <div class="list-group-item d-flex w-100 justify-content-between">
    <div>
      {#if $desk_nfc_read_test_button_enabled}
        <Button
          color=info
          title="Lees inhoud van NFC tag"
          on:click={handle_nfc_read_test}
        >
          Lees
        </Button>
      {/if}
    </div>
    <div>
      {#if $desk_nfc_clear_button_enabled
        && nfc_status === en_nfc_status.FOUND}
          <Button color=danger
            on:click={handle_nfc_clear}
            title="Wis deze NFC tag"
            >
            Wis
          </Button>
      {/if}
    </div>
  </div>
{/if}
