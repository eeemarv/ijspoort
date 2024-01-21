<script>
  import { ListGroupItem } from 'sveltestrap';
  import TagButton from './TagButton.svelte';
  import TagAddButton from './TagAddButton.svelte';
  import { createEventDispatcher } from 'svelte';
  import { tag_type_map } from '../../services/store';
  import { tag_map } from '../../services/store';
  import { focus_year } from '../../services/store';
  import Checkbox from '../Common/Checkbox.svelte';

  const dispatch = createEventDispatcher();

  export let type_id = undefined;
  export let auto_tag_on_nfc = false;

  const handle_open_tag_tab = (type_id) => {
    dispatch('open_tag_tab', type_id);
  };
</script>

{#if type_id && $tag_type_map.has(type_id)}

<ListGroupItem action>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <TagButton
        on:click={() => {handle_open_tag_tab(type_id);}}
        {type_id}
      />
    </div>
    <div>
      <span class=me-3>
        {$tag_map.has(type_id) ? $tag_map.get(type_id)?.size : '-'}
      </span>
      <TagAddButton {type_id} />
      <Checkbox title="Voeg tag automatisch toe bij gescand lid in focus jaar {$focus_year}" 
        name="auto_reg_{type_id}"
        bind:checked={auto_tag_on_nfc}
        c_class=d-inline-block
      />
    </div>
  </div>
</ListGroupItem>

{/if}

