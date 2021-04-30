<script>
  import { Button, CustomInput, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
  import PersonMemberId from '../Person/PersonMemberId.svelte';
  import PersonName from '../Person/PersonName.svelte';
  import { gate_count, gate_count_enabled, gate_nfc_enabled } from '../services/store';

  let open = false;

  export const launch = () => {
    open = true;
  }

  const toggle = () => {
    open = !open;
  };

  const handle_enter_on_gate_count = (e) => {
    if (!e){
      e = window.event;
    }
    if (e.code === 'Enter' || e.key === 'Enter'){
      toggle();
    }
  }

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
      bind:checked={$gate_count_enabled}
    />
    <div class=form-group>
      <label for=gate_count>
        Aantal personen nog toegelaten
      </label>
      <input
        type=number
        id=gate_count
        tabindex=0
        class=form-control
        bind:value={$gate_count}
        min=0
        max=999
        disabled={!$gate_count_enabled}
        on:keypress={handle_enter_on_gate_count}
      />
    </div>
  </ModalBody>
  <ModalFooter>
    <Button color=primary on:click={toggle}>
      Sluiten
    </Button>
  </ModalFooter>
</Modal>
