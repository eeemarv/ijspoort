<script>
    import { Modal, ModalHeader, ModalFooter, ModalBody, Progress } from 'sveltestrap';
    import { Button } from 'sveltestrap';

    export let is_open = false;
    export let color = 'primary';
    export let message;
    export let progress = 0;

    const toggle = () => {is_open = !is_open};
</script>

<Modal isOpen={is_open} {color} {toggle}>
    <ModalHeader {toggle}>NFC wordt geactiveerd</ModalHeader>
    <ModalBody>
        <Progress value={progress} color=warning/>
        {message}
    </ModalBody>
    <ModalFooter>
        &nbsp;
      <Button color="secondary" on:click={toggle}>
        Sluiten
      </Button>
    </ModalFooter>
  </Modal>
