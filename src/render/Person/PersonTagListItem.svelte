<script>
  import Icon from '@iconify/svelte';
  import timesIcon from '@iconify/icons-fa/times';
  import { Button } from 'sveltestrap';
  import { db_tag } from '../services/db';
  import Tag from '../Tag/Tag.svelte';
  import LocaleDateString from '../Common/LocaleDateString.svelte';

  const add_detect_time = 10000;
  const show_add_time = 1000;
  const show_del_time = 700;

  export let person_id = undefined;
  export let ts_epoch = undefined;
  export let type_id = undefined;

  export let tag;

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
    }, show_del_time);

    del = true;
  };

  if (ts_epoch > ((new Date).getTime() - add_detect_time)){
    add = true;
    setTimeout(() => {
      add = false;
   }, show_add_time);
  }
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
