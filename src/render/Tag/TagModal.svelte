<script>
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import TagTypeListTab from './TagTypeListTab.svelte';
  import TagTypePutTab from './TagTypePutTab.svelte';
  import TagTypeTab from './TagTypeTab.svelte';
  import { tag_type_map } from '../services/store';
  import { tag_types_enabled } from '../services/store';

  export const toggle = () => (open = !open);

  export const open_tab = (select_tab) => {
    tab = select_tab;
    open = true;
  };

  let tab = 'type_list';
  let open = false;

  let edit_tag_id = undefined;

  $: if (tab !== 'type_put'){
    edit_tag_id = undefined;
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
        on:edit={(e) => edit_tag_id = e.detail}
      />
      <TagTypePutTab
        {tab}
        bind:edit_tag_id
      />
      {#each [...$tag_type_map.keys()] as type_id(type_id)}
        {#if $tag_types_enabled[type_id]}
          <TagTypeTab {tab} {type_id} />
        {/if}
      {/each}
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
