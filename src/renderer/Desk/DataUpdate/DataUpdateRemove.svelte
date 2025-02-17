<script>
  const { ipcRenderer } = window.require('electron');
  import { Button, Card, FormGroup, Label } from 'sveltestrap';
  import { FormText, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import Icon from '@iconify/svelte';
  import exclamationTriangle from '@iconify/icons-fa/exclamation-triangle';
  import { person_remove_member_period } from '../../db_put/person_put';
  import MemberPeriodDropdown from '../../Common/MemberPeriodDropdown.svelte';

  let open = false;
  let dropdown_open = false;
  let selected_member_period = undefined;
  let verify = false;

  ipcRenderer.on('members.remove', () => {
    open = true;
  });

  export const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };

  const handle_remove = () => {
    console.log('handle_remove');
    person_remove_member_period(selected_member_period);

    open = false;
  };

  $: if (open){
    selected_member_period = undefined;
    verify = false;
  }

</script>

<Modal
  isOpen={open}
  {toggle}
  size=xl
>
  <ModalHeader {toggle}>
    <h1>
      Verwijder lidmaatschapsperiode
    </h1>
  </ModalHeader>
  <ModalBody>
    <Card body color=primary class=mb-2>
      <FormText>
        <Icon icon={exclamationTriangle} />
        Wis hier oude lidmaatschapperiodes.
        Persoonsdata wordt niet gewist.
        Alleen persoonsdata zonder lidmaatschapsperiodes kan
        gewist worden (zie "Leden data" menu).
      </FormText>
    </Card>
    <FormGroup>
      <Label for=select_member_period>
        Lidmaatschapsperiode te verwijderen
      </Label>
      <MemberPeriodDropdown
        {dropdown_open}
        bind:member_period={selected_member_period}
        id=select_member_period
      />
    </FormGroup>
    <FormGroup>
      <div class=form-check>
        <input
          class=form-check-input
          type=checkbox
          id=verify_remove_membership
          bind:checked={verify}
          disabled={!selected_member_period}
        >
        <label class=form-check-label for=verify_remove_membership>
          Ik ben zeker
        </label>
      </div>
    </FormGroup>

    <Button color=danger
      disabled={!verify || !selected_member_period}
      on:click={handle_remove}
    >
      Verwijder
    </Button>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
