<script>
  import ListGroup from '../../Common/ListGroup.svelte';
  import { desk_tag_types_enabled } from '../../../services/store';
  import { tag_type_map } from '../../../services/store';
  import TagCardListItem from './TagCardListItem.svelte';

</script>

<ListGroup>
  {#each [...$tag_type_map.keys()].reverse() as type_id(type_id)}
    {#if $desk_tag_types_enabled[type_id]}
      <TagCardListItem
        {type_id}
        on:open_tag_tab
      />
    {/if}
  {/each}
</ListGroup>
