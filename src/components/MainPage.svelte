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
  export let blocked_reg;
</script>

<RegCSVExport/>
<DbJSONExport/>

<Col md=9 class=vh-100>
  <ManualInput/>
  <Person on:register_by_manual />
  <RegList {blocked_reg}/>
</Col>

<Col class="bg-primary h-100">
  <EID/>
  <NFC on:register_by_nfc />
  <div class=m-3>
    <Stats/>
    <Clock/>
  </div>
</Col>
