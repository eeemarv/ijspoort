<script>
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import { focus_year } from '../services/store';
  import PersonFocusYearTag from './PersonFocusYearTag.svelte';
  import { person_map } from '../services/store';
  import { tag_types_enabled } from '../services/store';
  import { tag_display_enabled } from '../services/store';
  import { person_tag_map } from '../services/store';
  import { tag_type_map } from '../services/store';
  import Tag from '../Tag/Tag.svelte';

  export let person_id = undefined;
  export let show_member_year = false;
  export let show_tags = false;

  $: person = $person_map.get(person_id) ?? {};

</script>

{#if person_id}
  <PersonMemberId {person_id} />
  &nbsp;
  <PersonName {person_id} />

  {#if show_member_year && person.member_year && person.member_year['y' + $focus_year]}
    &nbsp;
    <PersonFocusYearTag />
  {/if}

  {#if show_tags && $tag_display_enabled && $person_tag_map.has(person_id)}
    {#each [...$tag_type_map.keys()].reverse() as type_id(type_id)}
      {#if $tag_types_enabled[type_id] && $person_tag_map.get(person_id).has(type_id)}
        {#each [...$person_tag_map.get(person_id).get(type_id)] as ts_epoch(ts_epoch)}
          <Tag {type_id} />
        {/each}
      {/if}
    {/each}
  {/if}

{/if}
