<script>
  import Icon from '@iconify/svelte';
  import exclamationTriangle from '@iconify/icons-fa/exclamation-triangle';
  import { Button, Card, FormGroup, FormText, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import { member_person_map } from '../../../services/store';
  import { person_cleanup } from '../../../db_put/person_put';

  let open = false;
  let verify = false;

  window.bridge.onMenuMembersCleanup(() => {
    open = true;
  });

  export const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };

  const handle_cleanup = () => {
    person_cleanup();
    open = false;
  };

  $: if (open){
    verify = false;
  }
</script>

<Modal
  isOpen={open}
  {toggle}
  size=xl
>
  <ModalHeader {toggle} color=info>
    <h1>
      Verwijder persoonsdata zonder lidmaatschap
    </h1>
  </ModalHeader>
  <ModalBody>
    <Card body color=primary class=mb-2>
      <FormText>
        <Icon icon={exclamationTriangle} />
        Data van personen die geen lidmaatschap meer hebben
        kan hier gewist worden.
      </FormText>
    </Card>
    <Card body color=warning class=mb-2>
      {#if $member_person_map.has('^')}
        Data van {$member_person_map.get('^').size}
        personen zonder lidmaatschap zal gewist worden.
      {:else}
        Momenteel is er geen data van personen
        zonder lidmaatschap.
      {/if}
    </Card>

    <FormGroup>
      <div class=form-check>
        <input
          class=form-check-input
          type=checkbox
          id=verify_person_cleanup
          bind:checked={verify}
          disabled={!$member_person_map.has('^')}
        >
        <label class=form-check-label for=verify_person_cleanup>
          Ik ben zeker
        </label>
      </div>
    </FormGroup>

    <Button color=danger
      disabled={!verify || !$member_person_map.has('^')}
      on:click={handle_cleanup}
    >
      Verwijder persoonsdata
    </Button>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
