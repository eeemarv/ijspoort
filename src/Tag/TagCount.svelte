<script>
  import { onMount } from 'svelte';
  import { db_tag } from '../services/db';

  export let tag_count = 0;

  const update_tag_count = () => {
    db_tag.query('search/count_total', {
      key: true,
      reduce: true,
      group: true
    }).then((res) => {
      console.log(res);
      if (res.rows.length > 0){
        tag_count = res.rows[0].value;
      } else {
        tag_count = 0;
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  onMount(() => {
    update_tag_count();
  });

  db_tag.changes({
    since: 'now',
    live: true
  }).on('change', (change) => {
    console.log('tag changes (Tag component)');
    console.log(change);
    update_tag_count();
  }).on('error', (err) => {
    console.log(err);
  });
</script>
