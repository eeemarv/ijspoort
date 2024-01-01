<script>
  import PersonTagListItem from './PersonTagListItem.svelte';
  import { tag_types_enabled } from '../services/store';
  import { tag_type_map } from '../services/store';
  import { person_tag_map } from '../services/store';
  import { tag_display_enabled } from '../services/store';

  export let person_id = undefined;
</script>

{#if person_id && $tag_display_enabled && $person_tag_map.has(person_id)}
  {#each [...$tag_type_map.keys()].reverse() as type_id(type_id)}
    {#if $tag_types_enabled[type_id] && $person_tag_map.get(person_id).has(type_id)}
      {#each [...$person_tag_map.get(person_id).get(type_id)] as ts_epoch(ts_epoch)}
        <PersonTagListItem {person_id} {type_id} {ts_epoch} />
      {/each}
    {/if}
  {/each}
{/if}
