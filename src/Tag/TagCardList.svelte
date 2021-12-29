<script>
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import Tag from './Tag.svelte';
  import TagAddButton from './TagAddButton.svelte';
  import { tag_count_by_type } from '../services/store';
  import { tag_types } from '../services/store';
  import { tag_type_enabled_sorted_id_ary } from '../services/store';
</script>

<ListGroup>
  {#each $tag_type_enabled_sorted_id_ary as tid(tid)}
    <ListGroupItem action>
      <div class="d-flex w-100 justify-content-between">
        <div>
          <Tag tag={$tag_types[tid]} />
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
