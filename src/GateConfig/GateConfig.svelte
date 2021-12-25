<script>
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import GateConfigMembers from './GateConfigMembers.svelte';
  import GateConfigMax from './GateConfigMax.svelte';
  import GateConfigTemp from './GateConfigTemp.svelte';

  export let open;
  export let tab = 'members';
  let gate_person;
  let gate_nfc_uid;

  $: if (open) {
    tab = 'members';
  }

  $: if (!open){
    gate_person = undefined;
    gate_nfc_uid = undefined;
  }

  export const click_open = (person, nfc_uid) => {
    if (!person || !nfc_uid){
      return;
    }
    gate_person = person;
    gate_nfc_uid = nfc_uid;
    open = true;
  };

  export const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };

  const handle_enter = (e) => {
    console.log('-- handle_enter --');
    if (!e){
      e = window.event;
    }
    if (e.code === 'Enter' || e.key === 'Enter'){
      close();
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
      Instellingen
    </h1>
  </ModalHeader>
  <ModalBody>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      <GateConfigMembers {tab} />
      <GateConfigMax {tab} on:keypress={handle_enter} />
      <GateConfigTemp {tab} />
    </TabContent>
  </ModalBody>
  <ModalFooterClose
    on:click={toggle}
    font_size=1.2em
    btn_lg={true}
  />
</Modal>
