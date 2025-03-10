<script>
  import { nfc_map } from '../../../services/store';
  import { person_nfc_map } from '../../../services/store';
  import PersonNfcListItem from './PersonNfcListItem.svelte';

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
    $nfc_map;
    $person_nfc_map;
    person_id;
    if (person_id){
      update_view();
    }
  }
</script>

{#each nfc_id_list as {nfc_id, abc_index, blocked}(nfc_id)}
  <PersonNfcListItem
    {nfc_id}
    {abc_index}
    {blocked}
  />
{/each}