<script>
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import TagButton from './TagButton.svelte';
  import TagAddButton from './TagAddButton.svelte';
  import { onMount, createEventDispatcher } from 'svelte';
  import { tag_types_enabled } from '../services/store';
  import { tag_type_table } from '../services/store';
  import { tag_count_table } from '../services/store';

  let tag_type_list = [];

  const dispatch = createEventDispatcher();

  let handle_open_tag_tab;

  onMount(() => {
    handle_open_tag_tab = (tid) => {
      dispatch('open_tag_tab', tid);
    };
  });

  const update_list = () => {
    let list = [];

    Object.keys($tag_type_table).forEach((type_id) => {
      if (!$tag_types_enabled[type_id]){
        return;
      }
      list.push(type_id);
    });

    tag_type_list = [...list];
  }

  $:{
    $tag_types_enabled;
    $tag_type_table;
    $tag_count_table;
    update_list();
  }

</script>

<ListGroup>
  {#each tag_type_list as type_id (type_id)}
    <ListGroupItem action>
      <div class="d-flex w-100 justify-content-between">
        <div>
          <TagButton
            on:click={() => {handle_open_tag_tab(type_id);}}
            {type_id}
          />
        </div>
        <div>
          <span class=me-3>
            {$tag_count_table[type_id] ?? '-'}
          </span>
          <TagAddButton {type_id} />
        </div>
      </div>
    </ListGroupItem>
  {/each}
</ListGroup>
