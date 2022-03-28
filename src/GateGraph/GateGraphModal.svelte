<script>
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent } from 'sveltestrap';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import GateCountUnique from './GateCountUnique.svelte';
  import GateGraph from './GateGraph.svelte';

  export let open = false;
  export let tab = 'count_unique';

  $: if (open) {
    tab = 'count_unique';
  }

  export const click_open = () => {
    open = true;
  };

  export const close = () => {
    open = false;
  };

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
      Poort in/uit statistieken
    </h1>
  </ModalHeader>
  <ModalBody>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      <GateCountUnique {tab} />
      <GateGraph {tab} />
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
