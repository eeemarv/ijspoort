<script>
  import { ListGroup } from 'sveltestrap';
  import { tag_types_enabled } from '../../services/store';
  import { tag_type_map } from '../../services/store';
  import TagCardListItem from './TagCardListItem.svelte';

</script>

<ListGroup>
  {#each [...$tag_type_map.keys()].reverse() as type_id(type_id)}
    {#if $tag_types_enabled[type_id]}
      <TagCardListItem 
        {type_id}
        on:open_tag_tab
      />
    {/if}
  {/each}
</ListGroup>
