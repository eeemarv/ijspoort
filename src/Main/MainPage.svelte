<script>
  import { Card, CardBody, Col } from 'sveltestrap';
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
  import TagCard from '../Tag/TagCard.svelte';
  import GateCard from '../Gate/GateCard.svelte';
  import { temp_display_enabled } from '../services/store';
  import { gate_display_enabled } from '../services/store';
  import { tag_display_enabled } from '../services/store';
  import { person } from '../services/store';

  let reg_auto_enabled;
  let reg;
  let reg_list;
  let block_time;
  let handle_click_manual_reg;
  let handle_person_already_registered;
  let handle_scanned_person_valid_member;
  let handle_scanned_person_not_member;
  let handle_scanned_uid_blocked;

  onMount(() => {
    block_time = reg.block_time;

    handle_click_manual_reg = () => {
      reg.add_by_manual($person);
      $person = undefined;
    };

    handle_person_already_registered = (event) => {
      reg_list.add_person_already_registered(event.detail.reg);
    };

    handle_scanned_person_valid_member = (event) => {
      if (reg_auto_enabled){
        reg.add_by_nfc(event.detail.person, event.detail.nfc_uid);
        return;
      }
      $person = event.detail.person;
    };

    handle_scanned_person_not_member = (event) => {
      $person = event.detail.person;
    };

    handle_scanned_uid_blocked = (event) => {
      $person = event.detail.person;
    };
  });
</script>

<Reg
  bind:this={reg}
  bind:block_time
  on:person_already_registered={handle_person_already_registered}
/>

<Col md=9 class=min-vh-100>
  <ManualInput />
  <Person on:click_manual_reg={handle_click_manual_reg} />
  <RegList
    bind:this={reg_list}
    {block_time}
  />
</Col>

<Col class="bg-primary min-vh-100">
  <NfcCard
    bind:reg_auto_enabled
    on:scanned_person_valid_member={handle_scanned_person_valid_member}
    on:scanned_person_not_member={handle_scanned_person_not_member}
    on:scanned_person_found
    on:scanned_person_not_found
    on:scanned_uid_found
    on:scanned_uid_not_found
    on:scanned_uid_blocked={handle_scanned_uid_blocked}

    on:nfc_on
    on:nfc_off
  />

  {#if $tag_display_enabled}
    <TagCard />
  {/if}

  {#if $gate_display_enabled}
    <GateCard />
  {/if}

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
