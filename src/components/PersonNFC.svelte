<script>
  import { onDestroy, onMount } from 'svelte';
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { db_eid, db_nfc } from '../services/pouchdb';
  import { person } from './../services/store';
  import PersonNfcItem from './PersonNFCItem.svelte';

  let nfc_list = [];

    const update_nfc_list = (person_id) => {
      db_nfc.query('search/by_person_id', {
            key: person_id,
            include_docs: true
        }).then(function (res) {
            console.log(res);
            nfc_list = res.rows;
        }).catch(function (err) {
            console.log(err);
        });
    };

    $: update_nfc_list($person._id);

    /*
    const unsubscribe = person.subscribe(() => {
      update_nfc_list();
    });
    onDestroy(unsubscribe);
    */

    db_nfc.changes({
        since: 'now',
        live: true
    }).on('change', (change) => {
        console.log('nfc changes (PersonNFC component)');
        console.log(change);
        update_nfc_list($person._id);
    }).on('error', (err) => {
        console.log(err);
    });

</script>

{#each nfc_list as item}
  <PersonNfcItem nfc={item.doc}/>
{/each}