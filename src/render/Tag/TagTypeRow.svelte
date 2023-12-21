<script>
  import { getContext } from 'svelte';
  import { ck_new_tag_type_id } from '../services/context_keys';
  import { ck_updated_tag_type_id } from '../services/context_keys';
  import Icon from '@iconify/svelte';
  import timesIcon from '@iconify/icons-fa/times';
  import pencilIcon from '@iconify/icons-fa/pencil';
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import TagEnableCheckbox from './TagEnableCheckbox.svelte';
  import { tag_type_map } from '../services/store';
  import { tag_map } from '../services/store';
  import Tag from './Tag.svelte';
  import { tag_type_del } from '../services/tag';

  const { setActiveTab } = getContext('tabContent');
  const dispatch = createEventDispatcher();

  export let type_id;

  let new_tag_type_id = getContext(ck_new_tag_type_id);
  let updated_tag_type_id = getContext(ck_updated_tag_type_id);

  let del = false;
  let add = false;
  let updated = false;

  $: tag_type = $tag_type_map.get(type_id);

  const handle_edit = () => {
    setActiveTab('type_put');    
    dispatch('edit', type_id);
  };

  const handle_delete = () => {
    setTimeout(() => {
      tag_type_del(type_id);
      del = false;
    }, 700);
    del = true;
  };

  const show_update = (updated_tag_type_id) => {
    if (updated_tag_type_id !== type_id){
      return;
    }
    setTimeout(() => {
      updated = false;
    }, 1000);
    updated = true;
  };

  const show_add = (new_tag_type_id) => {
    if (new_tag_type_id !== type_id){
      return;
    }
    setTimeout(() => {
      add = false;
    }, 1000);
    add = true;
  };

  $: show_update($updated_tag_type_id);
  $: show_add($new_tag_type_id);
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
    {#if $tag_map.get(type_id).size === 0}

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
