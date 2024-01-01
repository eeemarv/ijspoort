<script>
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import TagButton from './TagButton.svelte';
  import TagAddButton from './TagAddButton.svelte';
  import { createEventDispatcher } from 'svelte';
  import { tag_types_enabled } from '../services/store';
  import { tag_type_map } from '../services/store';
  import { tag_map } from '../services/store';

  const dispatch = createEventDispatcher();

  const handle_open_tag_tab = (tid) => {
    dispatch('open_tag_tab', tid);
  };
</script>

<ListGroup>
  {#each [...$tag_type_map.keys()].reverse() as type_id(type_id)}
    {#if $tag_types_enabled[type_id]}
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
              {$tag_map.has(type_id) ? $tag_map.get(type_id)?.size : '-'}
            </span>
            <TagAddButton {type_id} />
          </div>
        </div>
      </ListGroupItem>
    {/if}
  {/each}
</ListGroup>
