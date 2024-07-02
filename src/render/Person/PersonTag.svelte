<script>
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import { tag_types_enabled } from '../../services/store';
  import { tag_display_enabled } from '../../services/store';
  import { person_tag_map } from '../../services/store';
  import { tag_type_map } from '../../services/store';
  import Tag from '../Tag/Tag.svelte';
  import PersonMemberPeriodFilterTag from './PersonMemberPeriodFilterTag.svelte';
  import { member_period_filter } from '../../services/store';
  import { member_person_map } from '../../services/store';

  export let person_id = undefined;
  export let show_member_period = false;
  export let show_tags = false;

  $: member_period_tag_en = show_member_period
    && person_id
    && $member_period_filter
    && $member_person_map.has($member_period_filter)
    && $member_person_map.get($member_period_filter).has(person_id);

</script>

{#if person_id}
  <PersonMemberId {person_id} />
  &nbsp;
  <PersonName {person_id} />

  {#if member_period_tag_en}
    &nbsp;
    <PersonMemberPeriodFilterTag />
  {/if}

  {#if show_tags && $tag_display_enabled && $person_tag_map.has(person_id)}
    {#each [...$tag_type_map.keys()].reverse() as type_id(type_id)}
      {#if $tag_types_enabled[type_id] && $person_tag_map.get(person_id).has(type_id)}
        {#each [...$person_tag_map.get(person_id).get(type_id).keys()] as ts_epoch(ts_epoch)}
          <Tag {type_id} />
        {/each}
      {/if}
    {/each}
  {/if}

{/if}
