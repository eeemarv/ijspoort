<script>
  const { ipcRenderer } = window.require('electron');
  import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'sveltestrap';
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
    CSV Export registratie aantallen
  </ModalHeader>
  <ModalBody>
    <Row>
      <Col>
        <ListGroup>
          <ListGroupItem>
            <Button
              color=primary
              on:click={() => {reg_hour_count_csv_export(2, false); toggle();}}
            >
              Dinsdag voormiddag
            </Button>
            <Button
              color=primary
              on:click={() => {reg_hour_count_csv_export(2, true); toggle();}}
            >
              Dinsdag namiddag
            </Button>
          </ListGroupItem>
          <ListGroupItem>
            <Button
              color=primary
              on:click={() => {reg_hour_count_csv_export(4, false); toggle();}}
            >
              Donderdag voormiddag
            </Button>
            <Button
              color=primary
              on:click={() => {reg_hour_count_csv_export(4, true); toggle();}}
            >
              Donderdag namiddag
            </Button>
          </ListGroupItem>
          <ListGroupItem>
            <Button
              color=primary
              on:click={() => {reg_hour_count_csv_export(6); toggle();}}>
              Zaterdag
            </Button>
          </ListGroupItem>
          <ListGroupItem>
            <Button
              color=primary
              on:click={() => {reg_hour_count_csv_export(0); toggle();}}>
              Zondag
            </Button>
          </ListGroupItem>
        </ListGroup>
      </Col>
      <Col>
        <ListGroup>
          <ListGroupItem>
            <Button
              color=purple
              on:click={() => {reg_hour_count_csv_export(); toggle();}}
            >
              aantal/zwemmoment
            </Button>
          </ListGroupItem>
          <ListGroupItem>
            <Button
              color=purple
              on:click={() => {reg_week_count_csv_export(); toggle();}}
            >
              aantal/week
            </Button>
          </ListGroupItem>
          <ListGroupItem>
            <Button
              color=purple
              on:click={() => {reg_month_count_csv_export(); toggle();}}>
              aantal/maand
            </Button>
          </ListGroupItem>
        </ListGroup>
      </Col>
    </Row>

  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>