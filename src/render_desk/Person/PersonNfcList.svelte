<script>
  import { nfc_map } from '../../services/store';
  import { person_nfc_map } from '../../services/store';
  import { Button } from 'sveltestrap';
  import { Popover } from 'sveltestrap';
  import NfcTag from '../../render/Nfc/NfcTag.svelte';
  import { selected_nfc_id } from '../../services/store';
  import SelectableListGroupItem from '../../render/Common/SelectableListGroupItem.svelte';
  import { nfc_deblock } from '../../db_put/nfc_put';

  export let person_id = undefined;

  let nfc_id_list = [];

  const update_view = () => {
    const id_ary = [];

    if ($person_nfc_map.has(person_id)){
      const s = $person_nfc_map.get(person_id);
      [...s].reverse().forEach((nfc_id, i) => {
        id_ary.push({
          nfc_id: nfc_id,
          abc_index: s.size - i - 1,
          blocked: typeof $nfc_map.get(nfc_id).blocked !== 'undefined'
        });
      });
    }

    nfc_id_list = id_ary;
  };

  $: {
    $person_nfc_map;
    person_id;
    if (person_id){
      update_view();
    }
  }

  const deblock = () => {
    nfc_deblock(nfc_id);
  };
</script>

{#each nfc_id_list as {nfc_id, abc_index, blocked}(nfc_id)}
  <SelectableListGroupItem
    active={$selected_nfc_id === nfc_id}
    selectable={blocked}
    id={'tag_' + nfc_id}
  >
    <NfcTag 
      {nfc_id} 
      {abc_index}
      show_ts_epoch 
      show_uid_type
    />
  </SelectableListGroupItem>

  <Popover
    placement=bottom
    target={'tag_' + nfc_id}
    hideOnOutsideClick
    dismissible
  >
    <div slot=title>
      Geblokkeerde NFC tag 
      <NfcTag {nfc_id} {abc_index} />           
    </div>
    <Button 
      color=purple 
      on:click={() => {nfc_deblock(nfc_id);}}  
    >
      Deblokkeer
    </Button>          
  </Popover>
{/each}