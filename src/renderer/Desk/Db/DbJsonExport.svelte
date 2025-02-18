<script>
  import { Button, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import { db_json_export } from '../../db_export/db_json_export';

  let open = false;

  const toggle = () => (open = !open);

  window.bridge.onMenuDbJsonExport(() => {
    open = true;
  });
</script>

<Modal isOpen={open} {toggle}>
  <ModalHeader {toggle}>
    Export data
  </ModalHeader>
  <ModalBody>
    <Button color=warning on:click={() => {db_json_export(); toggle();}}>
      Export Db JSON
    </Button>
    <p>
      db_nfc, db_reg, db_person, db_gate, db_tag
    </p>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>