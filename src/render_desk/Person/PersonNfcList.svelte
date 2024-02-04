<script>
  import { person_nfc_map } from '../../services/store';
  import { ListGroupItem } from 'sveltestrap';
  import NfcTag from '../../render/Nfc/NfcTag.svelte';
  import { selected_nfc_id } from '../../services/store';

  export let person_id = undefined;

  let nfc_id_list = [];

  const update_view = () => {
    const id_ary = [];

    if ($person_nfc_map.has(person_id)){
      const s = $person_nfc_map.get(person_id);
      [...s].reverse().forEach((nfc_id, i) => {
        id_ary.push({
          nfc_id: nfc_id,
          abc_index: s.size - i - 1
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

{#each nfc_id_list as {nfc_id, abc_index}(nfc_id)}
  <ListGroupItem active={$selected_nfc_id === nfc_id}>
    <NfcTag
      {nfc_id}
      show_abc_index
      {abc_index}
      show_ts_epoch
    />
  </ListGroupItem>
{/each}