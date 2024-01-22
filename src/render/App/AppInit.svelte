<script>
  import { ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, Progress } from 'sveltestrap';
  import { db_init } from '../../db/db_init';
  import { e_db_init } from '../../services/events';
  import AwaitError from '../Await/AwaitError.svelte';

  let step = 0;
  let init_steps = [];

  e_db_init.addEventListener('step', (e) => {
    step = e.detail.step;
    init_steps = [[e.detail.step, e.detail.name], ...init_steps];
  });
</script>

{#await db_init()}
  <Modal isOpen>
    <ModalHeader>
      Initialisatie
    </ModalHeader>
    <ModalBody>
      <Progress 
        color=light 
        value={step}
        max=37 
      />
      <ListGroup>
        {#each init_steps as [step, name](step)}
          <ListGroupItem>
            {step}..{name}
          </ListGroupItem>
        {/each}
      </ListGroup>
    </ModalBody>
  </Modal>
{:catch error}
  <Modal isOpen size=xl contentClassName=bg-danger>
    <ModalHeader>
      Initialisatie Fout
    </ModalHeader>
    <ModalBody>
      <AwaitError {error} />
    </ModalBody>
  </Modal>
{/await}