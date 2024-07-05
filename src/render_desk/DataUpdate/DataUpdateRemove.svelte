<script>
  const { ipcRenderer } = window.require('electron');
  import { Badge, Button, ButtonDropdown, Card, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Label } from 'sveltestrap';
  import { FormText, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';
  import { member_person_map } from '../../services/store';
  import Icon from '@iconify/svelte';
  import exclamationTriangle from '@iconify/icons-fa/exclamation-triangle';
  import { person_remove_member_period } from '../../db_put/person_put';

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
      <ButtonDropdown {dropdown_open} id=select_member_period>
        <DropdownToggle caret
          color={selected_member_period ? 'success' : 'grey'}
          on:click={() => {dropdown_open = !dropdown_open;}}
          title="Selecteer te wissen lidmaatschapsperiode">
          {#if selected_member_period}
            {selected_member_period}
          {:else}
            *Geen geselecteerd*
          {/if}
        </DropdownToggle>
        <DropdownMenu>
          {#each [...$member_person_map.keys()].filter((k) => k !== '^').sort() as member_period(member_period)}
            <DropdownItem
              active={selected_member_period === member_period}
              on:click={() => {selected_member_period = member_period;}}
            >
              <Badge color=success class=me-2>
                {member_period}
              </Badge>
              {$member_person_map.get(member_period).size} leden
            </DropdownItem>
          {/each}
        </DropdownMenu>
      </ButtonDropdown>
    </FormGroup>
    <FormGroup>
      <div class=form-check>
        <input class=form-check-input type=checkbox id=verify_remove_membership bind:checked={verify}>
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
