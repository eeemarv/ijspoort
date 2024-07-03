<script>
  const { ipcRenderer } = window.require('electron');
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';
  let open = false;

  ipcRenderer.on('members.import', () => {
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
      Import leden data vanuit Assist voor lidmaatschapsperiode
    </h1>
  </ModalHeader>
  <ModalBody>




  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
