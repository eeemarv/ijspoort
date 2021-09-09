<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'sveltestrap';
  import PersonMemberId from '../Person/PersonMemberId.svelte';
  import PersonName from '../Person/PersonName.svelte';
  import Reg from '../Reg/Reg.svelte';
  import { gate_count_enabled, gate_count } from '../services/store';
  import NfcScan from './NfcScan.svelte';

  const dispatch = createEventDispatcher();

  let nfc_status;
  let reg;
  let handle_reg_by_nfc;
  let handle_blocked_reg;
  let handle_uid_not_found;
  let handle_person_not_found;
  let handle_not_member;
  let handle_launch_gate_config;
  let handle_nfc_off;
  let open = false;
  let person;
  let blocked_reg = false;
  let title;
  let modal_class = 'bg-default';
  let member_year_list = [];
  let year = new Date().getFullYear();
  let show_time = 5;

  const toggle = () => {
    open = !open;
  };

  const update_member_year_list = () => {
    if (person === undefined){
      member_year_list = [];
      return;
    }

    year = new Date().getFullYear();
    member_year_list = [];

    for (let y = year -1; y <= year + 1; y++){
      member_year_list = [...member_year_list, {
        year: y,
        is_member: person.member_year && person.member_year['y' + y]
      }];
    }
  };

  $: if (person) {
    update_member_year_list();
  }

  setInterval(() => {
    if (show_time > -1){
      show_time--;
    }
  }, 100);

  const show = () => {
    open = true;
    show_time = 5;
  };

  const hide = () => {
    setTimeout(() => {
      open = false;
      person = undefined;
      blocked_reg = false;
    }, show_time * 100);
  };

  onMount(() => {
    handle_reg_by_nfc = (event) => {
      blocked_reg = false;
      reg.add_by_nfc(event.detail.person);
      person = event.detail.person;
      if ($gate_count_enabled && ($gate_count <= 0)){
        modal_class = 'bg-warning';
        title = 'Volzet';
      } else {
        modal_class = 'bg-success';
        title = 'Ok';
        dispatch('trigger_open_gate', {
          person: person
        });
      }
      show();
    };

    handle_blocked_reg = (event) => {
      blocked_reg = true;
    };

    handle_uid_not_found = (event) => {
      title = 'Tag niet herkend';
      person = undefined;
      blocked_reg = false;
      modal_class = 'bg-danger';
      show();
    };

    handle_person_not_found = (event) => {
      title = 'Persoon niet herkend';
      person = undefined;
      blocked_reg = false;
      modal_class = 'bg-danger';
      show();
    };

    handle_not_member = (event) => {
      title = 'Lidmaatschap niet in orde';
      person = event.detail.person;
      blocked_reg = false;
      modal_class = 'bg-warning';
      show();
    };

    handle_launch_gate_config = (event) => {
      open = false;
      dispatch('launch_gate_config', {
        person: person
      });
    };

    handle_nfc_off = () => {
      hide();
    }
  });

</script>

<Modal
  isOpen={open}
  {toggle}
  size=xl
  backdropClassName={modal_class}
  fade={false}
>
  <ModalHeader
    class={modal_class}
    {toggle}
  >
    <h1>
      {title}
    </h1>
  </ModalHeader>
  <ModalBody class={modal_class}>
    {#if person}
      <h2>
        <PersonMemberId member_id={person.member_id} />
        <PersonName {person} />
      </h2>
    {/if}
    {#if blocked_reg}
      <p>
        <i>
          (Reeds geregistreerd.)
        </i>
      </p>
    {/if}
  </ModalBody>
  {#if person}
    <ModalFooter class={modal_class}>
      <div class="d-flex w-100 justify-content-between">
        <div class="bg-dark p-2">
          {#each member_year_list as item(item.year)}
            <Badge
              color={item.is_member ? 'success' : 'dark'}
              title="{item.is_member ? 'Lid in' : 'Geen lid in'} {item.year}"
              class=me-2
            >
              {item.year}
            </Badge>
          {/each}
        </div>
        <div>
          {#if person.group && person.group.trim() !== ''}
            <Button
              color=primary
              on:click={handle_launch_gate_config}
            >
              Poort instelling
            </Button>
          {/if}
        </div>
      </div>
    </ModalFooter>
  {/if}
</Modal>

<Reg bind:this={reg} on:blocked_reg={handle_blocked_reg} />

<NfcScan bind:nfc_status
  on:register={handle_reg_by_nfc}
  on:uid_not_found={handle_uid_not_found}
  on:person_not_found={handle_person_not_found}
  on:not_member={handle_not_member}
  on:nfc_off={handle_nfc_off}
/>
