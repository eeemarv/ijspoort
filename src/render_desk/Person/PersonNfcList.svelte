<script>
  import { person_nfc_map } from '../../services/store';
  import { ListGroupItem } from 'sveltestrap';
  import NfcTag from '../../render/Nfc/NfcTag.svelte';
  import { ev_nfc_scan } from '../../services/events';
  import { en_nfc_status } from '../../services/enum';

  export let person_id = undefined;
  let selected_nfc_id = undefined;

  const nfc_off_events = [
    'nfc_not_found', 
    'nfc_off', 
    'nfc_device_error',
    'nfc_device_off'
  ];

  ev_nfc_scan.addEventListener(en_nfc_status.FOUND, (e) => {
    selected_nfc_id = e.detail.nfc_id;
  });
  for (const ev_name of nfc_off_events){
    ev_nfc_scan.addEventListener(ev_name, () => {
      selected_nfc_id = undefined;
    });    
  }

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
  <ListGroupItem active={selected_nfc_id === nfc_id}>
    <NfcTag
      {nfc_id}
      show_abc_index
      {abc_index}
      show_ts_epoch
    />
  </ListGroupItem>
{/each}