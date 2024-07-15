<script>
  import TagButton from './TagButton.svelte';
  import TagAddButton from './TagAddButton.svelte';
  import { createEventDispatcher } from 'svelte';
  import { desk_nfc_auto_open_person_data_enabled } from '../../services/store';
  import { tag_type_map } from '../../services/store';
  import { tag_map } from '../../services/store';
  import { desk_member_period_filter } from '../../services/store';
  import Checkbox from '../../render/Common/Checkbox.svelte';
  import { desk_nfc_auto_tags } from '../../services/store';
  import ListGroupItem from '../../render/Common/ListGroupItem.svelte';

  const dispatch = createEventDispatcher();

  export let type_id = undefined;

  const handle_open_tag_tab = () => {
    dispatch('open_tag_tab', type_id);
  };
</script>

{#if type_id && $tag_type_map.has(type_id)}

<ListGroupItem>
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

      {#if $desk_nfc_auto_open_person_data_enabled && $desk_member_period_filter}
        <Checkbox title="Voeg tag automatisch toe bij gescand lidmaatschap in {$desk_member_period_filter}"
          name="auto_reg_{type_id}"
          bind:checked={$desk_nfc_auto_tags[type_id]}
          c_class=d-inline-block
        />
      {/if}

    </div>
  </div>
</ListGroupItem>

{/if}
