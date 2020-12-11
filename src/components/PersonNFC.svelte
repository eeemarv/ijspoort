<script>
  import { onMount } from 'svelte';
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { db_eid, db_nfc } from '../services/pouchdb';
  import { person } from './../services/store';

  let nfc_list = [];

  const update_nfc_list = () => {
    db_nfc.query('search/by_person_id', {
            key: $person._id
        }).then(function (res) {
            console.log(res);
            nfc_list = res.rows;
        }).catch(function (err) {
            console.log(err);
        });
    };

    onMount(() => {
      update_nfc_list();
    });

    db_nfc.changes({
        since: 'now',
        live: true
    }).on('change', (change) => {
        console.log('nfc changes (PersonNFC component)');
        console.log(change);
        update_nfc_list();
    }).on('error', (err) => {
        console.log(err);
    });

</script>

{#each nfc_list as nfc}
  <ListGroupItem>
    <Badge color=success>NFC</Badge>
    <Badge color=warning>{nfc.uid}</Badge>
  </ListGroupItem>
{/each}