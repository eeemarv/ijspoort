<script>
  import PersonTagListItem from './PersonTagListItem.svelte';
  import { desk_tag_types_enabled } from '../../../services/store';
  import { tag_type_map } from '../../../services/store';
  import { person_tag_map } from '../../../services/store';
  import { desk_tag_card_enabled } from '../../../services/store';

  export let person_id = undefined;
</script>

{#if person_id && $desk_tag_card_enabled && $person_tag_map.has(person_id)}
  {#each [...$tag_type_map.keys()].reverse() as type_id(type_id)}
    {#if $desk_tag_types_enabled[type_id] && $person_tag_map.get(person_id).has(type_id)}
      {#each [...$person_tag_map.get(person_id).get(type_id).values()] as tag(tag._id)}
        <PersonTagListItem {tag} />
      {/each}
    {/if}
  {/each}
{/if}
