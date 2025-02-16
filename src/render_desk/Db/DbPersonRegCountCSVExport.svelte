<script>
  const { ipcRenderer } = window.require('electron');
  import { Badge, Button, ButtonDropdown, Col, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Label, Modal, ModalBody, ModalHeader, Row } from 'sveltestrap';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';
  import { person_reg_count_csv_export } from '../../db_export/person_reg_count_csv_export';
  import ListGroup from '../../render/Common/ListGroup.svelte';
  import ListGroupItem from '../../render/Common/ListGroupItem.svelte';
  import Checkbox from '../../render/Common/Checkbox.svelte';
  import MemberPeriodDropdown from '../../render/Common/MemberPeriodDropdown.svelte';
  import { onMount } from 'svelte';
  import DateRangePicker from '../../render/Common/DateRangePicker.svelte';

  let open = false;
  const toggle = () => {
    open = !open;
  };
  let dropdown_open = false;

  let el_start;
  let el_end;
  let pick_start;
  let pick_end;

  let ts_start = undefined;
  let ts_end = undefined;
  let member_period = undefined;
  let anonymize = false;

  onMount(() => {

  });



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
    <DateRangePicker />

    <FormGroup>
      <Label for=member_period>Leden</Label>
      <MemberPeriodDropdown
        {dropdown_open}
        bind:member_period
      />
    </FormGroup>

    <FormGroup>
      <Checkbox name=anoniem
        bind:checked={anonymize}
      >
        Anoniem (geen namen van leden)
      </Checkbox>
    </FormGroup>

    <Button
      color=purple
      on:click={export_csv}>
      Export CSV
    </Button>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>