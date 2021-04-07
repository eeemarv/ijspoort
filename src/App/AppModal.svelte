<script>
  import { Progress } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { Modal, ModalHeader, ModalBody, ModalFooter } from 'sveltestrap';

  export let open = false;
  export let title = '';
  export let message = '';
  export let progress = 0;

  const toggle = () => {
      open = !open;
      pogress = 0;
  };
</script>

<Modal isOpen={open} toggle={toggle} contentClassName="bg-default">
  <ModalHeader>
    <slot name=header>
      {title}
    </slot>
  </ModalHeader>
  <ModalBody>
    <slot name=progress>
      <Progress value={progress} color=light/>
    </slot>
    <slot name=message>
      {message}
    </slot>
    <slot name=body></slot>
  </ModalBody>
  <ModalFooter>
    <div class="flex-d w-100 justify-confent-between">
      <div>
        <slot name=footer_left></slot>
      </div>
      <div>
        <Button color=secondary on:click={toggle}>
          Sluiten
        </Button>
      </div>
    </div>
  </ModalFooter>
</Modal>
