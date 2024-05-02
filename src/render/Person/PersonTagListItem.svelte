<script>
  import { getContext } from 'svelte';
  import { ck_new_tag_id } from '../services/context_keys';
  import Icon from '@iconify/svelte';
  import timesIcon from '@iconify/icons-fa/times';
  import { Button } from 'sveltestrap';
  import { db_tag } from '../services/db';
  import Tag from '../Tag/Tag.svelte';
  import LocaleDateString from '../Common/LocaleDateString.svelte';

  export let person_id = undefined;
  export let ts_epoch = undefined;
  export let type_id = undefined;

  export let tag;

  let new_tag_id = getContext(ck_new_tag_id);

  let add = false;
  let del = false;

  const handle_delete = (type_id, person_id, ts_epoch) => {
    return;

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

  /**
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
  */
</script>

<div class="list-group-item list-group-item-action"
  class:bg-danger={del}
  class:bg-success={add}
>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <Tag {type_id} />
      &nbsp;
      <LocaleDateString {ts_epoch} title="datum van aanmaak" />
    </div>
    <div>
      <Button
        size=sm
        color=danger
        title="Tag verwijderen"
        on:click={() => handle_delete(type_id, person_id, ts_epoch)}
      >
        <Icon icon={timesIcon} />
      </Button>
    </div>
  </div>
</div>
