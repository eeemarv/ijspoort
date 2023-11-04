<script>
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import { person_simular_lang_keys } from '../services/person_simular';
  import { get_search_str } from '../services/functions';
  import { person_map } from '../services/store';

  const dispatch = createEventDispatcher();

  export let key = undefined;
  export let group = undefined;
  export let person_id = undefined;
  export let simular_map = undefined;

  let search_key = undefined;

  const handle_click = () => {
    dispatch('click_simular', {
      search_key: search_key,
      key: key,
      group: group,
      person_id: person_id,
    });
  };

  $: {
    if (key === 'group' && group !== undefined){
      search_key = 'group.' + get_search_str(group);
    } else if (key && person_id && $person_map.get(person_id)[key]){
      search_key = key + '.' + get_search_str($person_map.get(person_id)[key]);
    } else {
      search_key = undefined;
    }
  }

</script>

{#if search_key && simular_map.has(search_key) && simular_map.get(search_key) > 1}
<Button
    size=sm
    color=info
    title={person_simular_lang_keys[key]}
    on:click={handle_click}
>
  &gt;&gt;
  {simular_map.get(search_key)}
</Button>
{/if}
