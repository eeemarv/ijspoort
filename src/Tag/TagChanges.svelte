<script>
  import { createEventDispatcher } from 'svelte';
  import { db_tag } from '../services/db';

  const dispatch = createEventDispatcher();

  db_tag.changes({
    since: 'now',
    live: true
  }).on('change', (change) => {
    console.log('tag changes');
    console.log(change);
    dispatch('tag_change', {
      change: change
    });
  }).on('error', (err) => {
    console.log(err);
  });
</script>
