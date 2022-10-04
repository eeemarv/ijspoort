<script>
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import GateConfigMembers from './GateConfigMembers.svelte';
  import GateConfigMax from './GateConfigMax.svelte';
  import GateConfigTemp from './GateConfigTemp.svelte';
  import GateConfigSound from './GateConfigSound.svelte';

  let open = false;
  export let tab = 'members';
  let gate_person;
  let gate_nfc_uid;
  let gate_config_auth = false;
  let gate_deblock_auth = false;

  $: if (open) {
    tab = 'members';
  }

  $: if (!open){
    gate_person = undefined;
    gate_nfc_uid = undefined;
    gate_config_auth = false;
    gate_deblock_auth = false;
  }

  export const click_open = (person, nfc_uid, config_auth, deblock_auth) => {
    if (!person || !nfc_uid){
      return;
    }

    gate_person = person;
    gate_nfc_uid = nfc_uid;
    gate_config_auth = config_auth;
    gate_deblock_auth = deblock_auth;
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
  fullscreen={true}
>
  <ModalHeader {toggle} color=info>
    <h1>
      Instellingen
    </h1>
  </ModalHeader>
  <ModalBody>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      {#if gate_config_auth}
        <GateConfigMembers {tab} />
        <GateConfigMax {tab} on:keypress={handle_enter} />
        <GateConfigTemp {tab} />
        <GateConfigSound {tab} />
      {/if}
    </TabContent>
  </ModalBody>
  <ModalFooterClose
    on:click={toggle}
    font_size=1.2em
    btn_lg={true}
  />
</Modal>
