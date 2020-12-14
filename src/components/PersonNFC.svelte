<script>
  import { db_nfc } from '../services/pouchdb';
  import { person, person_nfc_list } from './../services/store';
  import PersonNfcItem from './PersonNFCItem.svelte';

  const update_person_nfc_list = (person_id) => {
    db_nfc.query('search/by_person_id', {
          key: person_id,
          include_docs: true
      }).then(function (res) {
          console.log(res);
          $person_nfc_list = res.rows;
      }).catch(function (err) {
          console.log(err);
      });
  };

  $: update_person_nfc_list($person._id);

  db_nfc.changes({
      since: 'now',
      live: true
  }).on('change', (change) => {
      console.log('nfc changes (PersonNFC component)');
      console.log(change);
      update_person_nfc_list($person._id);
  }).on('error', (err) => {
      console.log(err);
  });

</script>

{#each $person_nfc_list as item}
  <PersonNfcItem nfc={item.doc}/>
{/each}