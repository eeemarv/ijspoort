<script>

  import PersonTagListItem from './PersonTagListItem.svelte';
  import { tag_display_enabled } from '../services/store';
  import { tag_types_enabled } from '../services/store';
  import { person_tag_map } from '../services/store';

  export let person_id = undefined;

</script>

{#if $tag_display_enabled}
  {#each [...($person_tag_map.get(person_id) ?? (new Map()))] as [type_id, ts_set] (type_id)}
    {#if $tag_types_enabled[type_id]}
      {#each [...ts_set] as ts_epoch (ts_epoch)}
        <PersonTagListItem {person_id} {type_id} {ts_epoch} />
      {/each}
    {/if}
  {/each}
{/if}