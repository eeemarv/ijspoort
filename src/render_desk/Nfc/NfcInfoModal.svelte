<script>
  import { Progress } from 'sveltestrap';
  import { Modal, ModalHeader, ModalBody } from 'sveltestrap';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';

  export let progress = 0;
  export let open = false;
  export let contentClassName = 'bg-dark';

  const toggle = () => {
    open = !open;
    progress = 0;
  };
</script>

<Modal isOpen={open} {toggle} {contentClassName}>
  <ModalHeader>
    <slot name=title></slot>
  </ModalHeader>
  <ModalBody>
    <Progress value={progress} color=light />
    <slot name=message></slot>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
