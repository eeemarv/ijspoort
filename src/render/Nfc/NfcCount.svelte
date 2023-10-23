<script>
  import { onMount } from 'svelte';
  import { db_nfc } from '../services/db';
  import { nfc_count, nfc_4b_count, nfc_7b_count } from '../services/store';

  export let count = 0;
  export let count_4b = 0;
  export let count_7b = 0;

  const update_nfc_count = () => {
    db_nfc.query('search/count_total', {
      key: true,
      reduce: true,
      group: true
    }).then((res) => {
      console.log(res);
      if (res.rows.length > 0){
        count = res.rows[0].value;
      } else {
        count = 0;
      }
      $nfc_count = count;
    }).catch((err) => {
      console.log(err);
    });

    db_nfc.query('search/count_4b_total', {
      key: true,
      reduce: true,
      group: true
    }).then((res) => {
      console.log(res);
      if (res.rows.length > 0){
        count_4b = res.rows[0].value;
      } else {
        count_4b = 0;
      }
      $nfc_4b_count = count_4b;
    }).catch((err) => {
      console.log(err);
    });

    db_nfc.query('search/count_7b_total', {
      key: true,
      reduce: true,
      group: true
    }).then((res) => {
      console.log(res);
      if (res.rows.length > 0){
        count_7b = res.rows[0].value;
      } else {
        count_7b = 0;
      }
      $nfc_7b_count = count_7b;
    }).catch((err) => {
      console.log(err);
    });
  };

  onMount(() => {
    update_nfc_count();
  });

  db_nfc.changes({
    since: 'now',
    live: true
  }).on('change', (change) => {
    console.log('nfc changes (NFC component)');
    console.log(change);
    update_nfc_count();
  }).on('error', (err) => {
    console.log(err);
  });
</script>
