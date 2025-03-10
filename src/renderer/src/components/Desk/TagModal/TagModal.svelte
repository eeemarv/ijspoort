<script>
  import { Modal, ModalBody, ModalHeader } from '@sveltestrap/sveltestrap';
  import { TabContent } from '@sveltestrap/sveltestrap';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import TagTypeListTab from './TagTypeListTab.svelte';
  import TagTypePutTab from './TagTypePutTab.svelte';
  import TagTypeTab from './TagTypeTab.svelte';
  import { tag_type_map } from '../../../services/store';
  import { desk_tag_types_enabled } from '../../../services/store';
  import { desk_selected_person_id } from '../../../services/store';

  export let tab = 'type_list';
  export let open = false;
  export const toggle = () => (open = !open);

  let edit_type_id = undefined;
  let updated_id = undefined;
  let deleted_id = undefined;

  $: if (tab !== 'type_put'){
    edit_type_id = undefined;
  }
  $: if ($desk_selected_person_id){
    open = false;
  }
</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Tags
  </ModalHeader>
  <ModalBody>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      <TagTypeListTab
        {tab}
        bind:updated_id
        bind:deleted_id
        on:edit={(e) => {edit_type_id = e.detail;}}
      />
      <TagTypePutTab
        {tab}
        bind:edit_type_id
        on:updated={(e) => updated_id = e.detail}
      />
      {#each [...$tag_type_map.keys()].reverse() as type_id(type_id)}
        {#if $desk_tag_types_enabled[type_id]}
          <TagTypeTab
            {tab}
            {type_id}
            on:edit={() => {edit_type_id = type_id;}}
            on:del={() => {deleted_id = type_id;}}
          />
        {/if}
      {/each}
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
