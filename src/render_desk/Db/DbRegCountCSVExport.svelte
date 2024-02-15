<script>
  const { ipcRenderer } = window.require('electron');
  import { Button, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';
  import { reg_hour_count_csv_export } from '../../db_export/reg_count_csv_export';
  import { reg_month_count_csv_export } from '../../db_export/reg_count_csv_export';
  import { reg_week_count_csv_export } from '../../db_export/reg_count_csv_export';
  import ListGroup from '../../render/Common/ListGroup.svelte';
  import ListGroupItem from '../../render/Common/ListGroupItem.svelte';

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
          color=purple
          on:click={() => {reg_hour_count_csv_export(); toggle();}}
        >
          Export CSV aantal/zwemmoment
        </Button>
      </ListGroupItem>
      <ListGroupItem>
        <Button 
          color=purple 
          on:click={() => {reg_week_count_csv_export(); toggle();}}
        >
          Export CSV aantal/week
        </Button>
      </ListGroupItem>
      <ListGroupItem>
        <Button 
          color=purple 
          on:click={() => {reg_month_count_csv_export(); toggle();}}>
          Export CSV aantal/maand
        </Button>
      </ListGroupItem>
    </ListGroup>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>