<script>
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import { focus_year } from '../services/store';
  import PersonFocusYearTag from './PersonFocusYearTag.svelte';
  import { person_table } from '../services/store';
  import { person_tag_table } from '../services/store';
  import { tag_types_enabled } from '../services/store';
  import Tag from '../Tag/Tag.svelte';

  export let person_id = undefined;
  export let show_member_year = false;
  export let show_tags = false;

  let tag_ary = [];
  let person = {};

  const build_tag_ary = () => {
    tag_ary = [];
    if (!person_id){
      return;
    }
    if (!$person_tag_table[person_id]){
      return;
    }
    Object.keys($person_tag_table[person_id]).forEach((type_id) => {
      if (!$tag_types_enabled[type_id]){
        return;
      }
      if (!$person_tag_table[person_id][type_id]){
        return;
      }
      $person_tag_table[person_id][type_id].forEach((ts) => {
        tag_ary = [...tag_ary, type_id];
      });
    });
  };

  $: {
    $person_tag_table[person_id];
    $tag_types_enabled;
    if (person_id !== undefined){
      person = $person_table[person_id];
      if (show_tags){
        build_tag_ary();
      }
    }
  }
</script>

{#if person_id}
  <PersonMemberId {person_id} />
  &nbsp;
  <PersonName {person_id} />
  {#if show_member_year && person.member_year && person.member_year['y' + $focus_year]}
    &nbsp;
    <PersonFocusYearTag />
  {/if}
  {#if show_tags }
    {#each tag_ary as t, index(index)}
      <Tag type_id={t} />
    {/each}
  {/if}
{/if}
