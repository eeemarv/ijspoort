<script>
  import { Popover } from 'sveltestrap';
  import NfcTag from '../../render/Nfc/NfcTag.svelte';
  import { desk_selected_nfc_id } from '../../services/store';
  import { nfc_deblock } from '../../db_put/nfc_put';
  import { get_random_str } from '../../services/functions';

  export let nfc_id = undefined;
  export let blocked = false;
  export let abc_index = undefined;

  let is_open = false;

  const close = () => {
    is_open = false;
  };

  const deblock = (nfc_id) => {
    close();
    console.log('deblock ' + nfc_id);
    nfc_deblock(nfc_id);
  };

  $:active = $desk_selected_nfc_id === nfc_id;
  $:id = get_random_str(12);
</script>

<svelte:body on:click={() => {close();}} />

{#if nfc_id && id}
  {#if blocked}
    <a
      class="list-group-item list-group-item-action"
      class:active
      on:click|stopPropagation
      on:keyup
      tabindex=-1
      {id}
    >
      <NfcTag
        {nfc_id}
        {abc_index}
        show_ts_epoch
        show_uid_type
      />
    </a>
    <Popover
      bind:isOpen={is_open}
      placement=bottom
      target={id}
    >
      <div slot=title>
        Geblokkeerde NFC tag
        <NfcTag {nfc_id} {abc_index} />
      </div>
      <span class="btn btn-purple"
        on:click|stopPropagation={() => {deblock(nfc_id);}}
        on:keyup
      >
        Deblokkeer
      </span>
    </Popover>
  {:else}
    <div class=list-group-item
      class:active
    >
      <NfcTag
        {nfc_id}
        {abc_index}
        show_ts_epoch
        show_uid_type
      />
    </div>
  {/if}
{/if}

<style>
a {
  cursor: pointer;
}
</style>