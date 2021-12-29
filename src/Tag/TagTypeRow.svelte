<script>
  import { getContext } from 'svelte';
  import { ck_new_tag_type_id } from '../services/context_keys';
  import { ck_updated_tag_type_id } from '../services/context_keys';
  import Icon from '@iconify/svelte';
  import timesIcon from '@iconify/icons-fa/times';
  import pencilIcon from '@iconify/icons-fa/pencil';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import Tag from './Tag.svelte';
  import TagEnableCheckbox from './TagEnableCheckbox.svelte';
  import { db_tag } from '../services/db';
  import { tag_types } from '../services/store';
  import { tag_count_by_type } from '../services/store';

  const { setActiveTab } = getContext('tabContent');
  const dispatch = createEventDispatcher();

  export let tag_type_id;
  let new_tag_type_id = getContext(ck_new_tag_type_id);
  let updated_tag_type_id = getContext(ck_updated_tag_type_id);

  let del = false;
  let add = false;
  let updated = false;

  let handle_edit;
  let handle_delete;

  $: tag = $tag_types[tag_type_id];

  onMount(() => {
    handle_edit = () => {
      dispatch('edit', tag_type_id);
      setActiveTab('type_put');
    };

    handle_delete = () => {
      let tag_type = tag;
      setTimeout(() => {
        db_tag.remove(tag_type).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });
        del = false;
      }, 700);
      del = true;
    };
  });

  const show_update = (updated_tag_type_id) => {
    if (updated_tag_type_id !== tag_type_id){
      return;
    }
    setTimeout(() => {
      updated = false;
    }, 1000);
    updated = true;
  };

  const show_add = (new_tag_type_id) => {
    if (new_tag_type_id !== tag_type_id){
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
    <TagEnableCheckbox tag_id={tag_type_id}>
      <Tag {tag} pointer />
    </TagEnableCheckbox>
  </td>
  <td>
    {$tag_count_by_type[tag_type_id] ?? '-'}
  </td>
  <td>
    {tag?.max_per_person}
  </td>
  <td>
    {tag?.description}
  </td>
  <td>
    <LocaleDateString ts={tag?.ts_epoch} title="datum van aanmaak" />
  </td>
  <td class=text-end>
    {#if typeof $tag_count_by_type[tag_type_id] === 'undefined'
      || !$tag_count_by_type[tag_type_id] === 'undefined'}

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
