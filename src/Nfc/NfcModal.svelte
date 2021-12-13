<script>
  import { Progress } from 'sveltestrap';
  import { Modal, ModalHeader, ModalBody } from 'sveltestrap';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';

  export let title = '';
  let open = false;
  let message = '';
  let progress = 0;

  export const close_after = (msec) => {
    setTimeout(() => {
      open = false;
    }, msec);
  };

  export const start = (msg) => {
    progress = 0;
    message = msg;
    open = true;
  };

  export const stop_timeout = (msg, prgrss = 100, msec_timeout = 1000) => {
    message = msg;
    progress = prgrss;
    open = true;
    setTimeout(() => {
      open = false;
    }, msec_timeout);
  };

  export const stop = (msg, prgrss = 100) => {
    message = msg;
    progress = prgrss;
    open = true;
  };

  const toggle = () => {
    open = !open;
    pogress = 0;
  };
</script>

<Modal isOpen={open} toggle={toggle} contentClassName="bg-default">
  <ModalHeader>
    {title}
  </ModalHeader>
  <ModalBody>
    <Progress value={progress} color=light/>
    {message}
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
