<script>
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import { onMount } from 'svelte';
  import { Button } from 'sveltestrap';
  import { person } from '../services/store';
  import { tag_types } from '../services/store';
  import { tag_person_count_by_type } from '../services/store';
  import { db_tag } from '../services/db';

  export let tag_type_id;
  let handle_add;
  let disabled = true;

  const add_tag = () => {
    let ts_epoch = (new Date()).getTime();
    let id = 't' + tag_type_id + '_' + $person._id + '_' + ts_epoch.toString();
    let tag = {
      ts_epoch: ts_epoch,
      person_id: $person._id,
      type_id: tag_type_id,
      _id: id
    };

    if (!$person){
      return;
    }

    db_tag.put(tag).then((res) => {
      console.log('db_tag.put');
      console.log(res);
    }).catch((err) => {
      console.log('ERR db_tag.put');
      console.log(err);
    });
  };

  $: disabled = !$person
    || $tag_types[tag_type_id].max_per_person <= $tag_person_count_by_type[tag_type_id];

  onMount(() => {
    handle_add = () => {
      add_tag();
    };
  });
</script>

<Button
  size=sm
  color=success
  title="Tag toevoegen"
  on:click={handle_add}
  {disabled}
>
  <Icon icon={plusIcon} />
</Button>
