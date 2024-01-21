<script>
  const { ipcRenderer } = window.require('electron');
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import ConfigYear from './ConfigYear.svelte';
  import ConfigDisplay from './ConfigDisplay.svelte';

  let open = false;
  let tab = 'year';

  $: if (open) {
    tab = 'year';
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
      <ConfigYear {tab} />
      <ConfigDisplay {tab} />
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
