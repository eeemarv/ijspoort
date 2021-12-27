<script>
  import { onMount } from 'svelte';
  import { db_tag } from '../services/db';

  export let tag_count = 0;
  export let type_count = 0;

  const update_tag_count = () => {
    db_tag.query('search/count_total', {
      reduce: true,
      group: true
    }).then((res) => {
      console.log('db_tag search/count_total');
      console.log(res);
      if (typeof res === 'object'
        && typeof res.rows === 'object'
        && res.rows.length > 0){
        res.rows.forEach(elem => {
          if (elem.key === 'type'){
            type_count = elem.value;
          } else if (elem.key === 'tag'){
            tag_count = elem.value;
          }
        });
      } else {
        tag_count = 0;
        type_count = 0;
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
