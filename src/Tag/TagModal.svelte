<script>
  import { onMount } from 'svelte';
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import TagTypesTab from './TagTypesTab.svelte';
  import TagTypePutTab from './TagTypePutTab.svelte';

  let tab = 'types';
  let edit_tag_id = undefined;

  export let open = false;
  export const toggle = () => (open = !open);

  onMount(() => {

  });

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
      <TagTypesTab {tab} on:edit={(e) => edit_tag_id = e.detail} />
      <TagTypePutTab {tab} bind:edit_tag_id />
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
