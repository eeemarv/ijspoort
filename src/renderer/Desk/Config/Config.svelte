<script>
  const { ipcRenderer } = window.require('electron');
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import ConfigDisplay from './ConfigDisplay.svelte';

  let open = false;
  let tab = 'display';

  $: if (open) {
    tab = 'display';
  }

  ipcRenderer.on('open_config', () => {
    open = true;
  });

  export const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };

</script>

<Modal
  isOpen={open}
  {toggle}
  size=xl
>
  <ModalHeader {toggle} color=info>
    <h1>
      Instellingen
    </h1>
  </ModalHeader>
  <ModalBody>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      <ConfigDisplay {tab} />
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
