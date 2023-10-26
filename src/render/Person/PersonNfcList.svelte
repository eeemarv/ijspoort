<script>
  import PersonNfcItem from './PersonNfcItem.svelte';
  import { person_nfc_table } from '../services/store';

  export let person_id = undefined;

  let nfc_id_list = [];

  const update_view = () => {
    id_ary = [];
    Object.keys($person_nfc_table[person_id] ?? {}).forEach((nfc_id) => {
      id_ary.push(nfc_id);
    });
    nfc_id_list = [...id_ary];
  };

  $: {
    $person_nfc_table[person_id];
    person_id;
    if (person_id){
      update_view();
    }
  }

</script>

{#each nfc_id_list as nfc_id(nfc_id)}
  <PersonNfcItem {nfc_id}/>
{/each}