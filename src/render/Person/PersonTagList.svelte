<script>

  import PersonTagListItem from './PersonTagListItem.svelte';
  import { person_tag_table } from '../services/store';
  import { tag_types_enabled } from '../services/store';

  export let person_id = undefined;

  let tag_ary = [];

  const update_view = () => {
    tag_ary = [];
    Object.keys($person_tag_table[person_id] ?? {}).forEach((type_id) => {
      if (!$tag_types_enabled[type_id]){
        return;
      }
      ($person_tag_table[person_id][type_id] ?? []).forEach((ts_epoch) => {
        tag_ary = [...tag_ary, {
          type_id: type_id,
          ts_epoch: ts_epoch
        }];
      });
    });
  };

  $: {
    person_id;
    $person_tag_table;
    $tag_types_enabled;
    if (person_id){
      update_view();
    }
  }

</script>

{#each tag_ary as t(t.ts_epoch)}

  <PersonTagListItem
    {person_id}
    type_id={t.type_id}
    ts_epoch={t.ts_epoch}
  />
{/each}