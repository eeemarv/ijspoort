<script>
  import Icon from '@iconify/svelte';
  import timesIcon from '@iconify/icons-fa/times';
  import { Button } from 'sveltestrap';
  import Tag from '../../render/Tag/Tag.svelte';
  import LocaleDateString from '../../render/Common/LocaleDateString.svelte';
  import { tag_del } from '../../db_put/tag_put';

  const add_detect_time = 10000;
  const show_add_time = 1000;
  const show_del_time = 700;

  export let tag = undefined;

  let add = false;
  let del = false;

  const handle_delete = () => {
    if (typeof tag === 'undefined'){
      return;
    }

    setTimeout(() => {
      tag_del(tag);
    }, show_del_time);

    del = true;
  };

  if (typeof tag !== 'undefined' 
    && tag.ts_epoch > ((new Date).getTime() - add_detect_time)){
    add = true;
    setTimeout(() => {
      add = false;
   }, show_add_time);
  }
</script>

{#if tag}
  <div class="list-group-item list-group-item-action"
    class:bg-danger={del}
    class:bg-success={add}
  >
    <div class="d-flex w-100 justify-content-between">
      <div>
        <Tag type_id={tag.type_id} />
        &nbsp;
        <LocaleDateString 
          ts_epoch={tag.ts_epoch} 
          title="datum van aanmaak" 
        />
      </div>
      <div>
        <Button
          size=sm
          color=danger
          title="Tag verwijderen"
          on:click={() => handle_delete()}
        >
          <Icon icon={timesIcon} />
        </Button>
      </div>
    </div>
  </div>
{/if}
