<script>
  import { ListGroupItem } from 'sveltestrap';
  import TagButton from './TagButton.svelte';
  import TagAddButton from './TagAddButton.svelte';
  import { createEventDispatcher } from 'svelte';
  import { person_nfc_auto_enabled, tag_type_map } from '../../services/store';
  import { tag_map } from '../../services/store';
  import { focus_year } from '../../services/store';
  import Checkbox from '../../render/Common/Checkbox.svelte';
  import { auto_tag_on_nfc } from '../../services/store';

  const dispatch = createEventDispatcher();

  export let type_id = undefined;

  const handle_open_tag_tab = () => {
    dispatch('open_tag_tab', type_id);
  };
</script>

{#if type_id && $tag_type_map.has(type_id)}

<ListGroupItem action>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <TagButton
        on:click={() => {handle_open_tag_tab();}}
        {type_id}
      />
    </div>
    <div>
      <span class=me-3>
        {$tag_map.has(type_id) ? $tag_map.get(type_id)?.size : '-'}
      </span>

      <TagAddButton {type_id} />

      {#if $person_nfc_auto_enabled}
        <Checkbox title="Voeg tag automatisch toe bij gescand lid in focus jaar {$focus_year}" 
          name="auto_reg_{type_id}"
          bind:checked={$auto_tag_on_nfc[type_id]}
          c_class=d-inline-block
        />
      {/if}

    </div>
  </div>
</ListGroupItem>

{/if}

