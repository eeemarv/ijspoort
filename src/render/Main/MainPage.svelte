<script>
  import { reg_add } from '../services/reg';
  import { setContext } from 'svelte';
  import { ck_new_tag_id } from '../services/context_keys';
  import { ck_new_tag_type_id } from '../services/context_keys';
  import { ck_updated_tag_type_id } from '../services/context_keys';
  import { writable } from 'svelte/store';
  import { Card, CardBody, Col } from 'sveltestrap';
  import ManualInput from '../ManualInput/ManualInput.svelte';
  import Person from '../Person/Person.svelte';
  import RegList from '../Reg/RegList.svelte';
  import TemperatureCard from '../Common/TemperatureCard.svelte';
  import Clock from '../Common/Clock.svelte';
  import DbSync from '../Db/DbSync.svelte';
  import Reg from '../Reg/Reg.svelte';
  import { onMount } from 'svelte';
  import MainPageLinks from './MainPageLinks.svelte';
  import NfcCard from '../Nfc/NfcCard.svelte';
  import TagCard from '../Tag/TagCard.svelte';
  import GateCard from '../Gate/GateCard.svelte';
  import { selected_person_id, temp_display_enabled } from '../services/store';
  import { gate_display_enabled } from '../services/store';
  import { tag_display_enabled } from '../services/store';
  import { reg_nfc_auto_enabled } from '../services/store';
  import { person_nfc_auto_enabled } from '../services/store';
  import { person } from '../services/store';
  import MemberYearCardBody from '../Common/MemberYearCardBody.svelte';
  import MemberYearModal from '../Common/MemberYearModal.svelte';

  const new_tag_id = writable();
  setContext(ck_new_tag_id, new_tag_id);
  const new_tag_type_id = writable();
  setContext(ck_new_tag_type_id, new_tag_type_id);
  const updated_tag_type_id = writable();
  setContext(ck_updated_tag_type_id, updated_tag_type_id);

  let show_blocked_reg;
  let open_member_year_modal;

  let cmp_reg;
  let cmp_reg_list;
  let block_time;
  let handle_click_manual_reg;
  let handle_person_already_registered;
  let handle_scanned_person_valid_member;
  let handle_scanned_person_not_member;
//  let handle_scanned_uid_blocked;

  onMount(() => {
    block_time = cmp_reg.block_time;

    handle_click_manual_reg = () => {
      cmp_reg.add_by_manual($person);
      $selected_person_id = undefined;
    };

    handle_person_already_registered = (e) => {
      show_blocked_reg(person_id);
    };

    handle_scanned_person_valid_member = (e) => {

      if ($reg_nfc_auto_enabled){
        reg_add(e.detail.person_id, e.detail.nfc_uid);
        // cmp_reg.add_by_nfc(e.detail.person, e.detail.nfc_uid);
      }

      if ($person_nfc_auto_enabled){
        $selected_person_id = e.detail.selected_person_id;
        //$person = e.detail.person;
      }

    };

    handle_scanned_person_not_member = (e) => {
      $person = e.detail.person;
    };

    /*
    handle_scanned_uid_blocked = (e) => {
      $person = e.detail.person;
    };
    */
  });
</script>

<MemberYearModal bind:open_member_year_modal />

<Reg
  bind:this={cmp_reg}
  bind:block_time
  on:person_already_registered={handle_person_already_registered}
/>

<Col md=9 class=min-vh-100>
  <ManualInput />

  <Person on:click_manual_reg={handle_click_manual_reg} />

  <RegList
    bind:show_blocked_reg
    bind:this={cmp_reg_list}
  />
</Col>

<Col class="bg-primary min-vh-100">
  <NfcCard
    on:scanned_person_valid_member={handle_scanned_person_valid_member}
    on:scanned_person_not_member={handle_scanned_person_not_member}
    on:scanned_person_found
    on:scanned_person_not_found
    on:scanned_uid_found
    on:scanned_uid_not_found

    on:nfc_on
    on:nfc_off
  />

  {#if $tag_display_enabled}
    <TagCard
      on:new_tag={(e) => $new_tag_id = e.detail}
      on:new_tag_type={(e) => $new_tag_type_id = e.detail}
      on:updated_tag_type={(e) => $updated_tag_type_id = e.detail}
    />
  {/if}

  {#if $gate_display_enabled}
    <GateCard />
  {/if}

  {#if $temp_display_enabled}
    <TemperatureCard horizontal />
  {/if}

  <div class=my-2>
    <Card>
      <MemberYearCardBody on:click={open_member_year_modal} />
      <CardBody class="d-flex w-100 justify-content-between">
        <DbSync />
        <Clock />
      </CardBody>
    </Card>
  </div>

  <div class=my-2>
    <MainPageLinks />
  </div>
</Col>
