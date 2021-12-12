<script>
  import { Card, CardBody, CardHeader, CardFooter, Col } from 'sveltestrap';
  import ManualInput from '../ManualInput/ManualInput.svelte';
  import Person from '../Person/Person.svelte';
  import RegList from '../Reg/RegList.svelte';
  import Temperature from '../Common/Temperature.svelte';
  import Stats from '../Common/Stats.svelte';
  import Clock from '../Common/Clock.svelte';
  import DbSync from '../Db/DbSync.svelte';
  import Reg from '../Reg/Reg.svelte';
  import { onMount } from 'svelte';
  import MainPageLinks from './MainPageLinks.svelte';
  import NfcCard from '../Nfc/NfcCard.svelte';
  import GateSens from '../Gate/GateSens.svelte';
  import { temp_display_enabled } from '../services/store';

  let reg;
  let reg_list;
  let block_time;
  let handle_reg_by_manual;
  let handle_reg_by_nfc;
  let handle_blocked_reg;

  onMount(() => {
    block_time = reg.block_time;

    handle_reg_by_manual = () => {
      reg.add_by_manual();
    };

    handle_reg_by_nfc = (event) => {
      reg.add_by_nfc(event.detail.person);
    };

    handle_blocked_reg = (event) => {
      reg_list.add_blocked_reg(event.detail.reg);
    };
  });
</script>

<Reg bind:this={reg} on:blocked_reg={handle_blocked_reg} />

<Col md=9 class=min-vh-100>
  <ManualInput />
  <Person on:register={handle_reg_by_manual} />
  <RegList bind:this={reg_list} {block_time} />
</Col>

<Col class="bg-primary min-vh-100">
  <NfcCard on:register={handle_reg_by_nfc} />

  <Card class=m-3>
    <CardHeader>
      Poort
    </CardHeader>
    <CardFooter>
      <GateSens />
    </CardFooter>
  </Card>

  <div class=m-3>
    <Stats />
    {#if $temp_display_enabled}
      <Temperature />
    {/if}
    <Card>
      <CardBody class="d-flex w-100 justify-content-between">
        <DbSync />
        <Clock />
      </CardBody>
    </Card>
  </div>

  <div class=m-3>
    <MainPageLinks />
  </div>
</Col>
