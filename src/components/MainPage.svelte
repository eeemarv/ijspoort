<script>
  import { Button, Col, Popover, Tooltip } from 'sveltestrap';
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
  let y;
  let el_btn_to_top;

  const handle_register_by_manual = (() => {
    reg_list.add_reg($person, 'manual');
    $person = undefined;
  });
  const handle_register_by_nfc = ((event) => {
    $person = undefined;
    reg_list.add_reg(event.detail.person, 'nfc');
  });

  const handle_to_top = (() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  });
  const handle_scroll = () => {
    if (y > 50){
      el_btn_to_top.style.visibility = 'visible';
    } else {
      el_btn_to_top.style.visibility = 'hidden';
    }
  };
</script>

<svelte:window on:scroll={handle_scroll} bind:scrollY={y}/>

<RegCSVExport />
<DbJSONExport />

<Col md=9 class=vh-100>
  <ManualInput />
  <Person on:register_by_manual={handle_register_by_manual} />
  <RegList bind:this={reg_list}/>
</Col>

<Col class="bg-primary h-100">
  <EID />
  <NFC on:register_by_nfc={handle_register_by_nfc} />
  <div class=m-3>
    <Stats />
    <Clock />
  </div>
</Col>

<button class="btn btn-info" on:click={handle_to_top} bind:this={el_btn_to_top} title="Ga naar boven">
  &Hat; TOP
</button>

<style>
  button {
    right: 0;
    bottom: 0;
    position: fixed;
    visibility: hidden;
  }
</style>
