<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { db_tag } from '../services/db';
  import { tag_types } from '../services/store';
  import { tag_types_enabled } from '../services/store';
  import { tag_count_by_type } from '../services/store';
  import { tag_total_count } from '../services/store';
  import { tag_type_count } from '../services/store';
  import { tag_type_enabled_sorted_id_ary } from '../services/store';
  import { tag_type_sorted_id_ary } from '../services/store';
  import { person } from '../services/store';
  import { tag_person_sorted_ary } from '../services/store';
  import { tag_person_count_by_type } from '../services/store';

  const dispatch = createEventDispatcher();

  const update_tag_person_sorted = async () => {
    console.log('UPDATE_TAG_PERSON_SORTED');

    if (!$person){
      console.log('++++ Empty tag person sorted ary +++');
      $tag_person_sorted_ary = [];
      $tag_person_count_by_type = {};
      return;
    }

    let t_list = [];
    let tc = {};
    let t_ary = $tag_type_enabled_sorted_id_ary;

    if (!t_ary.length){
      console.log('+++ tag_type_enabled_sorted_id_ary empty');
      $tag_person_sorted_ary = [];
      $tag_person_count_by_type = {};
      return;
    }

    try {
      for (let i = 0; i < t_ary.length; i++){
        let startkey = 't' + t_ary[i] + '_' + $person?._id + '_';
        let res = await db_tag.allDocs({
          startkey: startkey,
          endkey: startkey + '\uffff',
          include_docs: true
        });

        if (typeof res === 'object'
          && typeof res.rows === 'object'){
          res.rows.forEach((w) => {
            t_list = [...t_list, w.doc];
            if (typeof tc[w.doc.type_id] === 'undefined'){
              tc[w.doc.type_id] = 0;
            }
            tc[w.doc.type_id]++;
          });
        }
      };
    } catch (err) {
      console.log('ERR db_tag.allDocs');
      console.log(err);
    }

    $tag_person_sorted_ary = t_list;
    $tag_person_count_by_type = tc;

    console.log('tag_person_sorted_ary');
    console.log($tag_person_sorted_ary);
  };

  const update_sorted = () => {
    let id_ary = [];
    let enabled_id_ary = [];

    Object.keys($tag_types).forEach((id) => {
      if (typeof $tag_types_enabled[id] === 'boolean'){
        enabled_id_ary = [...enabled_id_ary, id];
      }
      id_ary = [...id_ary, id];
    });

    enabled_id_ary.sort((a, b) => $tag_types[b].ts_epoch - $tag_types[a].ts_epoch);
    id_ary.sort((a, b) => $tag_types[b].ts_epoch - $tag_types[a].ts_epoch);

    $tag_type_enabled_sorted_id_ary = enabled_id_ary;
    $tag_type_sorted_id_ary = id_ary;
  }

  const update = () => {
    let t_types = {};
    let t_enabled = $tag_types_enabled;

    db_tag.allDocs({
      startkey: '0_',
      endkey: '0_\uffff',
      include_docs: true
    }).then((res) => {
      console.log('db_tag alldocs all types');
      console.log(res);
      if (typeof res.rows === 'object'
        && res.rows.length){
        res.rows.forEach((v) => {
          t_types[v.id] = v.doc;
        });
      }
      Object.keys($tag_types_enabled).forEach((id) => {
        if (typeof t_types[id] !== 'object'){
          delete t_enabled[id];
        }
      });

      $tag_types = t_types;
      $tag_types_enabled = t_enabled;
    }).catch((err) => {
      console.log(err);
    });
  };

  const update_count = () => {
    let count_by_type = {};
    let total_count = 0;
    let type_count = 0;

    db_tag.query('search/count_by_type', {
      reduce: true,
      group: true
    }).then((res) => {
      console.log('db_tag count_by_type');
      console.log(res);
      if (typeof res === 'object'
        && typeof res.rows === 'object'
        && res.rows.length > 0){
        res.rows.forEach(elem => {
          if (elem.key === 'type'){
            type_count = elem.value;
            return;
          }
          count_by_type[elem.key] = elem.value;
          total_count += elem.value;
        });
      }

      $tag_count_by_type = count_by_type;
      $tag_total_count = total_count;
      $tag_type_count = type_count;
    }).catch((err) => {
      console.log(err);
    });
  };

  onMount(() => {
    update();
    update_count();
    update_sorted();
    update_tag_person_sorted();
  });

  $: {
    $tag_types_enabled;
    update_sorted();
    update_tag_person_sorted();
  }

  $: {
    $person;
    update_tag_person_sorted();
  }

  db_tag.changes({
    since: 'now',
    live: true
  }).on('change', (change) => {
    console.log('tag changes');
    console.log(change);
    update();
    update_count();
    update_sorted();
    update_tag_person_sorted();

    if (change.id.startsWith('t0_')){
      if (change.deleted){
        console.log('event deleted_tag ' + change.id);
        dispatch('deleted_tag', change.id);
      } else {
        console.log('event new_tag ' + change.id);
        dispatch('new_tag', change.id);
      }
    } else if (change.id.startsWith('0_')){
      if (change.deleted){
        console.log('event deleted_tag_type ' + change.id);
        dispatch('deleted_tag_type', change.id);
      } else if (change.changes[0].rev.startsWith('1')){
        console.log('event new_tag_type ' + change.id);
        dispatch('new_tag_type', change.id);
      } else {
        console.log('event updated_tag_type ' + change.id);
        dispatch('updated_tag_type', change.id);
      }
    }
  }).on('error', (err) => {
    console.log(err);
  });
</script>
