<script>
  import { Modal, ModalBody, ModalHeader, Progress } from 'sveltestrap';
  import { db_init } from '../db/db_init';
  import { ev_db_init } from '../services/events';
  import AwaitError from '../Await/AwaitError.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import ListGroup from '../Common/ListGroup.svelte';
  import ListGroupItem from '../Common/ListGroupItem.svelte';

  let step = 0;
  let init_steps = [];
  let trig = {};

  export let btn_lg = false;
  export let font_size = '1em';

  ev_db_init.addEventListener('step', (e) => {
    step = e.detail.step;
    init_steps = [[e.detail.step, e.detail.name], ...init_steps];
  });

  const restart = (ignore_network) => {
    init_steps = [];
    if (ignore_network){
      trig = {ignore_network: true};
      return;
    }
    trig = {};
  }
</script>

{#await db_init(trig)}
  <Modal isOpen>
    <ModalHeader>
      Initialisatie
    </ModalHeader>
    <ModalBody>
      <Progress
        color=light
        value={step}
        max=39
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
  <Modal isOpen size=lg contentClassName=bg-danger>
    <ModalHeader>
      Initialisatie Fout
    </ModalHeader>
    <ModalBody>
      <AwaitError {error} />
    </ModalBody>
    <ModalBody class=bg-maroon>
      <h3>Belangrijk!</h3>
      <p>
        Controleer netwerkverbinding en kies
        hieronder altijd de knop "Opnieuw" (Met netwerk).
      </p>
      <p>
        Wanneer initialisatie toch niet lukt, herstart
        dan de computer.
      </p>
      <p>
        De optie "Opnieuw zonder netwerk" kan enkel
        als er echt geen netwerk voorhanden is.
        Deze optie is alleen nuttig om data te raadplegen.
        Het is dat geval beter om geen nieuwe data aan te maken.
      </p>
    </ModalBody>
    <ModalFooterClose>
      <svelte:fragment slot=close>
        <button
          type=button
          class="btn btn-primary"
          class:btn-lg={btn_lg}
          style="--font-size: {font_size};"
          on:click={() => restart(true)}
        >
          Opnieuw zonder netwerk
        </button>
        <button
          type=button
          class="btn btn-primary"
          class:btn-lg={btn_lg}
          style="--font-size: {font_size};"
          on:click={() => restart(false)}
        >
          Opnieuw
        </button>
      </svelte:fragment>
    </ModalFooterClose>
  </Modal>
{/await}

<style>
  button {
   font-size: var(--font-size);
  }
</style>