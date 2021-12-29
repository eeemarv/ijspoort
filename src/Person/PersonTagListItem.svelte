<script>
  import { getContext } from 'svelte';
  import { ck_new_tag_id } from '../services/context_keys';
  import Icon from '@iconify/svelte';
  import timesIcon from '@iconify/icons-fa/times';
  import { onMount } from 'svelte';
  import { Button } from 'sveltestrap';
  import { db_tag } from '../services/db';
  import { tag_types } from '../services/store';
  import Tag from '../Tag/Tag.svelte';
  import LocaleDateString from '../Common/LocaleDateString.svelte';

  export let tag;
  let new_tag_id = getContext(ck_new_tag_id);

  let handle_delete;
  let add = false;
  let del = false;

  onMount(() => {
    handle_delete = (tag) => {
      setTimeout(() => {
        db_tag.remove(tag).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });
        del = false;
      }, 700);
      del = true;
    };
  });

  const show_add = (new_tag_id) => {
    if (new_tag_id !== tag._id){
      return;
    }
    setTimeout(() => {
      add = false;
    }, 1000);
    add = true;
  }

  $: show_add($new_tag_id);
</script>

<div class="list-group-item list-group-item-action"
  class:bg-danger={del}
  class:bg-success={add}
>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <Tag tag={$tag_types[tag.type_id]} />
      &nbsp;
      <LocaleDateString ts={tag.ts_epoch} title="datum van aanmaak" />
    </div>
    <div>
      <Button
        size=sm
        color=danger
        title="Tag verwijderen"
        on:click={() => handle_delete(tag)}
      >
        <Icon icon={timesIcon} />
      </Button>
    </div>
  </div>
</div>
