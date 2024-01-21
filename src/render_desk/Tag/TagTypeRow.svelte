<script>
  import { getContext } from 'svelte';
  import Icon from '@iconify/svelte';
  import timesIcon from '@iconify/icons-fa/times';
  import pencilIcon from '@iconify/icons-fa/pencil';
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import LocaleDateString from '../../render/Common/LocaleDateString.svelte';
  import TagEnableCheckbox from './TagEnableCheckbox.svelte';
  import { tag_type_map } from '../../services/store';
  import { tag_map } from '../../services/store';
  import Tag from '../../render/Tag/Tag.svelte';
  import { tag_type_del } from '../../db_put/tag_put';

  const { setActiveTab } = getContext('tabContent');
  const dispatch = createEventDispatcher();

  const add_detect_time = 5000;
  const show_add_time = 1000;
  const show_updated_time = 1000;
  const show_del_time = 700;

  export let type_id;
  export let updated_id;

  let del = false;
  let add = false;
  let updated = false;

  $: tag_type = $tag_type_map.get(type_id) ?? {};

  const handle_edit = () => {
    setActiveTab('type_put');    
    dispatch('edit', type_id);
  };

  const handle_delete = () => {
    setTimeout(() => {
      tag_type_del(type_id);
    }, show_del_time);
    del = true;
  };

  $: if (typeof updated_id === 'string' 
      && updated_id === type_id){
    setTimeout(() => {
      updated = false;
    }, show_updated_time);
    updated = true;
    updated_id = undefined;
  };

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
    {#if !$tag_map.has(type_id) || $tag_map.get(type_id).size === 0}

      <Button
        color=danger
        title="tag type verwijderen"
        on:click={handle_delete}
      >
        <Icon icon={timesIcon} />
      </Button>

    {/if}

    <Button
      color=primary
      title="tag type aanpassen"
      on:click={handle_edit}
    >
      <Icon icon={pencilIcon} />
    </Button>
  
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
