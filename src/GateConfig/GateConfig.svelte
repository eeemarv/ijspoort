<script>
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import { cache_nfc_person } from '../services/store';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import GateConfigMembers from './GateConfigMembers.svelte';
  import GateConfigMax from './GateConfigMax.svelte';
  import GateConfigTemp from './GateConfigTemp.svelte';

  let open = false;
  let tab = 'members';

  $: if (open) {
    tab = 'members';
  }

  export const launch = () => {
    if (!$cache_nfc_person){
      console.log('-- cache_nfc_person not set --');
      return;
    }
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
  <ModalFooterClose on:click={toggle} />
</Modal>
