<script>
  import { Button, CustomInput, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'sveltestrap';
  import PersonMemberId from '../Person/PersonMemberId.svelte';
  import PersonName from '../Person/PersonName.svelte';
  import { gate_count_enabled, gate_nfc_enabled } from '../services/store';

  let open = false;

  export const launch = () => {
    open = true;
  }

  const toggle = () => {
    open = !open;
  };

</script>

<Modal
  isOpen={open}
  {toggle}
  size=xl
>
  <ModalHeader {toggle} color=info>
    <h1>
      Poort instelling (blokkage)
    </h1>
  </ModalHeader>
  <ModalBody>
    <CustomInput
      id=nfc_switch
      type=switch
      label="Toegang enkel voor leden"
      value={$gate_nfc_enabled}
    />
  </ModalBody>
  <ModalBody>
    <CustomInput
      id=count_switch
      type=switch
      label="Maximum aantal (teller)"
      value={$gate_count_enabled}
    />

  </ModalBody>
  <ModalFooter>
    <Button color=primary on:click={toggle}>
      Sluiten
    </Button>
  </ModalFooter>
</Modal>
