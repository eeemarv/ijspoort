<script>
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import TagTypeListTab from './TagTypeListTab.svelte';
  import TagTypePutTab from './TagTypePutTab.svelte';
  import TagTypeTab from './TagTypeTab.svelte';
  import { tag_type_enabled_sorted_id_ary } from '../services/store';

  export let tab = 'type_list';
  export let open = false;
  export const toggle = () => (open = !open);

  let edit_type_id = undefined;
  let updated_id = undefined;

  $: if (tab !== 'type_put'){
    edit_type_id = undefined;
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
        on:edit={(e) => edit_type_id = e.detail}
      />
      <TagTypePutTab
        {tab}
        bind:edit_type_id
        on:updated={(e) => updated_id = e.detail}
      />
      {#each $tag_type_enabled_sorted_id_ary as tid(tid)}
        <TagTypeTab {tab} type_id={tid} />
      {/each}
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
