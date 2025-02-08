<script>
  const { ipcRenderer } = window.require('electron');
  import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'sveltestrap';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';
  import { person_reg_count_csv_export } from '../../db_export/person_reg_count_csv_export';
  import ListGroup from '../../render/Common/ListGroup.svelte';
  import ListGroupItem from '../../render/Common/ListGroupItem.svelte';

  let open = false;
  const toggle = () => {
    open = !open;
  };
/*
  let ts_start = 1704063600000;
  let ts_end = 1735682400000;
  let member_period = '2024';
  let anonymize = false;
*/

  let ts_start = 1735686000000;
  let ts_end = 1738360800000;
  let member_period = '25';
  let anonymize = false;

/*
  let ts_start = undefined;
  let ts_end = undefined;
  let member_period = undefined;
  let anonymize = false;
*/

  const export_csv = () => {
    person_reg_count_csv_export(ts_start, ts_end, member_period, anonymize);
    toggle();
  };

  ipcRenderer.on('person.reg.count.csv.export', () => {
    open = true;
  });
</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    CSV Export registraties verdeling personen over zwemmomenten
  </ModalHeader>
  <ModalBody>

    <Button
      color=purple
      on:click={export_csv}>
      Export CSV
    </Button>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>