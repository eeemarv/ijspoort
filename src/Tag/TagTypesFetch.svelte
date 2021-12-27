<script>
  import { onMount } from 'svelte';
  import { db_tag } from '../services/db';
  import { tag_types, tag_types_enabled } from '../services/store';

  const update = () => {
    db_tag.allDocs({
      startkey: '0_',
      endkey: '0_\uffff',
      include_docs: true
    }).then((res) => {
      console.log('TagTypesFetch db_tag alldocs');
      console.log(res);
      let tag_type_keys = {};
      if (typeof res.rows === 'object'
        && res.rows.length){
        res.rows.forEach((v) => {
          tag_type_keys[v.id] = true;
          tag_types.put(v.id, v.doc);
        });
      }
      Object.keys($tag_types_enabled).forEach((id) => {
        if (typeof tag_type_keys[id] !== 'boolean'){
          tag_types_enabled.disable(id);
        }
      });
      Object.keys($tag_types).forEach((id) => {
        if (typeof tag_type_keys[id] !== 'boolean'){
          tag_types.del(id);
        }
      });
    }).catch((err) => {
      console.log(err);
    });
  };

  onMount(() => {
    update();
  });

  db_tag.changes({
    since: 'now',
    live: true
  }).on('change', (change) => {
    console.log('tag changes (TagTypesFetch component)');
    console.log(change);
    update();
  }).on('error', (err) => {
    console.log(err);
  });
</script>
