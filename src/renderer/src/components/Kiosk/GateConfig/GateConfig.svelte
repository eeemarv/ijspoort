<script>
  import { Modal, ModalBody, ModalHeader } from '@sveltestrap/sveltestrap';
  import { TabContent } from '@sveltestrap/sveltestrap';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import GateConfigMembers from './GateConfigMembers.svelte';
  import GateConfigMax from './GateConfigMax.svelte';
  import GateConfigTemp from './GateConfigTemp.svelte';
  import GateConfigNfcBlock from './GateConfigNfcBlock.svelte';
  import GateConfigSound from './GateConfigSound.svelte';

  let open = false;
  let tab = 'members';

  $: if (open) {
    tab = 'members';
  }

  export const open_gate_config = () => {
    open = true;
  };

  export const close_gate_config = () => {
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
  fullscreen={true}
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
      <GateConfigNfcBlock {tab} />
      <GateConfigTemp {tab} />
      <GateConfigSound {tab} />
    </TabContent>
  </ModalBody>
  <ModalFooterClose
    on:click={toggle}
    font_size=1.2em
    btn_lg
  />
</Modal>
