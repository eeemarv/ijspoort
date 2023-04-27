<script>
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import TagButton from './TagButton.svelte';
  import TagAddButton from './TagAddButton.svelte';
  import { tag_count_by_type } from '../services/store';
  import { tag_types } from '../services/store';
  import { tag_type_enabled_sorted_id_ary } from '../services/store';
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let handle_open_tag_tab;

  onMount(() => {
    handle_open_tag_tab = (tid) => {
      dispatch('open_tag_tab', tid);
    };
  });

</script>

<ListGroup>
  {#each $tag_type_enabled_sorted_id_ary as tid(tid)}
    <ListGroupItem action>
      <div class="d-flex w-100 justify-content-between">
        <div>
          <TagButton
            on:click={() => {handle_open_tag_tab(tid);}}
            tag={$tag_types[tid]}
          />
        </div>
        <div>
          <span class=me-3>
            {$tag_count_by_type[tid] ?? '-'}
          </span>
          <TagAddButton tag_type_id={tid} />
        </div>
      </div>
    </ListGroupItem>
  {/each}
</ListGroup>
