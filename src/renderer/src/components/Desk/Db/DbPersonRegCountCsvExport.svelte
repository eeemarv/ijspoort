<script>
  import { Button, FormGroup, Label, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import { person_reg_count_csv_export } from '../../../db_export/person_reg_count_csv_export';
  import Checkbox from '../../Common/Checkbox.svelte';
  import MemberPeriodDropdown from '../../Common/MemberPeriodDropdown.svelte';
  import { onMount } from 'svelte';
  import DateRangePicker from '../../Common/DateRangePicker.svelte';

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

  window.bridge.onMenuPersonRegCountCsvExport(() => {
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