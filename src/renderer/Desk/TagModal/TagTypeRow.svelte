<script>
  import LocaleDateString from '../../Common/LocaleDateString.svelte';
  import TagEnableCheckbox from '../Tag/TagEnableCheckbox.svelte';
  import { tag_type_map } from '../../services/store';
  import { tag_map } from '../../services/store';
  import Tag from '../../Tag/Tag.svelte';
  import TagTypeEditButton from './TagTypeEditButton.svelte';
  import TagTypeDelButton from './TagTypeDelButton.svelte';

  const add_detect_time = 5000;
  const show_add_time = 2000;
  const show_updated_time = 2000;

  export let type_id;
  export let updated_id;
  export let deleted_id;

  let del = false;
  let add = false;
  let updated = false;

  $: tag_type = $tag_type_map.get(type_id) ?? {};

  $: if (typeof updated_id === 'string'
      && updated_id === type_id){
    setTimeout(() => {
      updated = false;
    }, show_updated_time);
    updated = true;
    updated_id = undefined;
  };

  $: if (typeof deleted_id === 'string'
    && deleted_id === type_id){
    del = true;
  }

  $: if (typeof tag_type !== 'undefined'
    && tag_type.ts_epoch > ((new Date).getTime() - add_detect_time)){
    add = true;
    setTimeout(() => {
      add = false;
   }, show_add_time);
  }
</script>

<tr
  class:bg-primary={updated}
  class:bg-success={add}
  class:bg-danger={del}
>
  <td>
    <TagEnableCheckbox {type_id}>
      <Tag {type_id} />
    </TagEnableCheckbox>
  </td>
  <td>
    {$tag_map.has(type_id) ? $tag_map.get(type_id).size : '-'}
  </td>
  <td>
    {tag_type.max_per_person ?? '-'}
  </td>
  <td>
    {tag_type.description ?? '-'}
  </td>
  <td>
    <LocaleDateString ts_epoch={tag_type.ts_epoch} title="datum van aanmaak" />
  </td>
  <td class=text-end>
    <TagTypeDelButton
      {type_id}
      on:del={() => {del = true;}}
    />
    <TagTypeEditButton
      {type_id}
      on:edit
    />
  </td>
</tr>

<style>
tr:nth-child(even) {
  background-color: #222;
}
tr {
  border-bottom: 1px solid #666;
  height: 2.5em;
}
td {
  border-left: 1px solid #666;
}
tr:hover {
  background-color: #444;
}

</style>
