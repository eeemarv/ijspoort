<script>
  import { nfc_map, person_nfc_map } from '../../services/store';
  import { ListGroupItem } from 'sveltestrap';
  import NfcTag from '../../render/Nfc/NfcTag.svelte';
  import { selected_nfc_id } from '../../services/store';
    import PersonNfcBlockedItem from './PersonNfcBlockedItem.svelte';

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
          blocked: typeof $nfc_map.get(nfc_id).blocked === 'object'
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

</script>

{#each nfc_id_list as {nfc_id, abc_index, blocked}(nfc_id)}
  {#if blocked}
    <PersonNfcBlockedItem {nfc_id} {abc_index} />
  {:else}
    <ListGroupItem active={$selected_nfc_id === nfc_id}>
      <NfcTag {nfc_id} {abc_index}
        show_ts_epoch 
        show_uid_type
      />
    </ListGroupItem>
  {/if}
{/each}