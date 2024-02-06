<script>
  const { ipcRenderer } = window.require('electron');
  import { Button, Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem } from 'sveltestrap';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';
  import { reg_hour_count_csv_export } from '../../db_export/reg_count_csv_export';
  import { reg_month_count_csv_export } from '../../db_export/reg_count_csv_export';
  import { reg_week_count_csv_export } from '../../db_export/reg_count_csv_export';

  let open = false;
  const toggle = () => {
    open = !open;
  };

  ipcRenderer.on('reg.count.csv.export', () => {
    open = true;
  });
</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Export registratie aantallen
  </ModalHeader>
  <ModalBody>
    <ListGroup>
      <ListGroupItem>
        <Button 
          color=warning 
          on:click={() => {reg_hour_count_csv_export(); toggle();}}
        >
          Export CSV aantal/zwemmoment
        </Button>
      </ListGroupItem>
      <ListGroupItem>
        <Button 
          color=warning 
          on:click={() => {reg_week_count_csv_export(); toggle();}}
        >
          Export CSV aantal/week
        </Button>
      </ListGroupItem>
      <ListGroupItem>
        <Button 
          color=warning 
          on:click={() => {reg_month_count_csv_export(); toggle();}}>
          Export CSV aantal/maand
        </Button>
      </ListGroupItem>
    </ListGroup>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>