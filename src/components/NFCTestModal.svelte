<script>
    import { Modal, ModalHeader, ModalFooter, ModalBody, Progress, ListGroup, ListGroupItem } from 'sveltestrap';
    import { Button } from 'sveltestrap';

    export let is_open = false;
    export let color = 'primary';
    export let message_list = [];
    export let progress = 0;

    const toggle = () => {is_open = !is_open};
</script>

<Modal isOpen={is_open} {color} {toggle}>
    <ModalHeader {toggle}>NFC lees test</ModalHeader>
    <ModalBody>
        <Progress value={progress} color=warning/>
        <ListGroup>
        {#each message_list as msg}
          <ListGroupItem>
            {msg}
          </ListGroupItem>
        {/each}
        </ListGroup>
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" on:click={toggle}>
        Sluiten
      </Button>
    </ModalFooter>
  </Modal>
