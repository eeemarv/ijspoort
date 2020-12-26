<script>
  import { Col } from 'sveltestrap';
  import ManualInput from './ManualInput.svelte';
  import Person from './Person.svelte';
  import RegList from './RegList.svelte';
  import EID from './EID.svelte';
  import NFC from './NFC.svelte';
  import RegCSVExport from './RegCSVExport.svelte';
  import Stats from './Stats.svelte';
  import Clock from './Clock.svelte';
  import DbJSONExport from './DbJSONExport.svelte';
  import { person } from './../services/store';

  let reg_list;

  const handle_register_by_manual = (() => {
    reg_list.add_reg($person, 'manual');
    $person = undefined;
  });
  const handle_register_by_nfc = ((event) => {
    $person = undefined;
    reg_list.add_reg(event.detail.person, 'nfc');
  });
</script>

<RegCSVExport/>
<DbJSONExport/>

<Col md=9 class=vh-100>
  <ManualInput/>
  <Person on:register_by_manual={handle_register_by_manual} />
  <RegList bind:this={reg_list}/>
</Col>

<Col class="bg-primary h-100">
  <EID/>
  <NFC on:register_by_nfc={handle_register_by_nfc} />
  <div class=m-3>
    <Stats/>
    <Clock/>
  </div>
</Col>
