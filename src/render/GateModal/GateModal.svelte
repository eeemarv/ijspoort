<script>
  import lodash from 'lodash';
  import { createEventDispatcher, onMount } from 'svelte';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
  import PersonTag from '../Person/PersonTag.svelte';
  import Reg from '../Reg/Reg.svelte';
  import { gate_count_enabled } from '../../services/store';
  import { gate_count } from '../../services/store';
  import { gate_nfc_enabled } from '../../services/store';
  import NfcScan from '../Nfc/NfcScan.svelte';
  import GateConfigButton from '../GateConfig/GateConfigButton.svelte';
  import { sound_ok_enabled } from '../../services/store';
  import { sound_error_enabled } from '../../services/store';

  const dispatch = createEventDispatcher();

  export let open = false;
  export let open_gate;

  let cmp_reg;
  let already_registered;
  let show_reg_person = true;
  let reg_person;
  let reg_nfc_uid;

  let handle_person_already_registered;
  let handle_scanned_person_valid_member;
  let handle_scanned_person_not_member;
  let handle_scanned_person_not_found;
  let handle_scanned_uid_not_found;
//  let handle_scanned_uid_blocked;
  let handle_nfc_off;
  let handle_click_open_gate_config;
  let sound_ok;
  let sound_error;

  let title;
  let modal_class = 'bg-default';
  let member_year_list = [];
  let year;

  const minimum_open_time = 2000;
  let open_time = 0;
  let open_timeout_ref = 0;

  const ok_sound = new Audio('../audio/ok3.mp3');
  const error_sound = new Audio('../audio/error2.mp3');

  const toggle = () => {
    open = !open
  };

  const update_member_year_list = () => {
    if (reg_person === undefined){
      member_year_list = [];
      return;
    }

    year = new Date().getFullYear();
    member_year_list = [];

    for (let y = year -1; y <= year + 1; y++){
      member_year_list = [...member_year_list, {
        year: y,
        is_member: reg_person.member_year && reg_person.member_year['y' + y]
      }];
    }
  };

  $: if (reg_person) {
    update_member_year_list();
  }

  setInterval(() => {
    if (open_time > 0){
      open_time -= 100;
    }
  }, 100);

  const start_open_timer = () => {
    open = true;
    open_time = minimum_open_time;
    clearTimeout(open_timeout_ref);
  };

  const stop_open_timer = () => {
    open_timeout_ref = setTimeout(() => {
      open = false;
    }, open_time);
  };

  const load_reg_person_nfc = (event) => {
    already_registered = false;
    reg_person = event.detail.person;
    reg_nfc_uid = event.detail.nfc_uid;
    cmp_reg.add_by_nfc(reg_person, reg_nfc_uid);
    show_reg_person = true;
  };

  const clear_reg_person_nfc = () => {
    reg_person = undefined;
    reg_nfc_uid = undefined;
  };

  const check_wait = () => {
    if ($gate_nfc_enabled && open_gate){

      modal_class = 'bg-warning';
      title = 'Wacht even tot je voorganger door de poort is en probeer opnieuw.';
      show_reg_person = false;
      start_open_timer();
      sound_error();
      return true;
    }
    return false;
  }

  onMount(() => {
    ok_sound.addEventListener('canplaythrough', (ev) => {
      sound_ok = () => {
        if (!$sound_ok_enabled){
          return;
        }
        ok_sound.play();
      };
    });

    error_sound.addEventListener('canplaythrough', (ev) => {
      sound_error = () => {
        if (!$sound_error_enabled){
          return;
        }
        error_sound.play();
      };
    });

    handle_person_already_registered = () => {
      already_registered = true;
    };

    handle_scanned_person_valid_member = (event) => {
      dispatch('trigger_close_gate_config');

      if (!lodash.isEqual(reg_person, event.detail.person)){
        if (check_wait()){
          return;
        }
      }

      load_reg_person_nfc(event);

      if ($gate_count_enabled && ($gate_count <= 0)){
        modal_class = 'bg-warning';
        title = 'Volzet';
        start_open_timer();
        sound_error();
        return;
      }

      modal_class = 'bg-success';
      title = 'Ok';

      dispatch('trigger_open_gate', {
        person: reg_person,
        nfc_uid: event.detail.nfc_uid
      });

      start_open_timer();
      sound_ok();
    };

    handle_scanned_person_not_member = (event) => {
      dispatch('trigger_close_gate_config');
      if (check_wait()){
        return;
      }
      load_reg_person_nfc(event);
      modal_class = 'bg-warning';
      title = 'Lidmaatschap niet in orde';
      start_open_timer();
      sound_error();
    };

    handle_scanned_person_not_found = (event) => {
      dispatch('trigger_close_gate_config');

      if (check_wait()){
        return;
      }

      clear_reg_person_nfc();

      modal_class = 'bg-danger';
      title = 'Persoon niet herkend';

      start_open_timer();
      sound_error();
    };

    handle_scanned_uid_not_found = (event) => {
      dispatch('trigger_close_gate_config');
      if (check_wait()){
        return;
      }
      clear_reg_person_nfc();

      modal_class = 'bg-danger';
      title = 'Tag niet herkend';

      start_open_timer();
      sound_error();
    };

    /*
    handle_scanned_uid_blocked = (event) => {

      dispatch('trigger_close_gate_config');
      if (check_wait()){
        return;
      }

      load_reg_person_nfc(event);

      modal_class = 'bg-danger';
      title = 'Tag geblokkeerd';

      start_open_timer();
      sound_error();
    };
    */

    handle_click_open_gate_config = () => {
      open = false;
    };

    handle_nfc_off = () => {
      stop_open_timer();
    }
  });

</script>

<Modal
  isOpen={open}
  {toggle}
  fullscreen={true}
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
  {#if show_reg_person}
    <ModalBody class={modal_class}>
      {#if reg_person}
        <h2>
          <PersonTag person_id={reg_person._id} />
        </h2>
      {/if}
      {#if reg_person && already_registered}
        <p>
          <i>
            Reeds geregistreerd.
          </i>
        </p>
      {/if}
    </ModalBody>
    {#if reg_person}
      <ModalFooter class={modal_class}>
        <div class="d-flex w-100 justify-content-between">
          <div class="bg-dark p-2">
            {#each member_year_list as item(item.year)}
              <span class="me-2 badge bg-{item.is_member ? 'success' : 'dark'}"
                title="{item.is_member ? 'Lid in' : 'Geen lid in'} {item.year}"
              >
                {item.year}
              </span>
            {/each}
          </div>
          <div>
            <GateConfigButton
              person={reg_person}
              nfc_uid={reg_nfc_uid}
              on:click_open_gate_config
              on:click_open_gate_config={handle_click_open_gate_config}
            />
          </div>
        </div>
      </ModalFooter>
    {/if}
  {/if}
</Modal>

<Reg
  bind:this={cmp_reg}
  on:person_already_registered={handle_person_already_registered}
/>

<NfcScan
  on:scanned_person_valid_member={handle_scanned_person_valid_member}
  on:scanned_person_not_member={handle_scanned_person_not_member}
  on:scanned_person_not_found={handle_scanned_person_not_found}
  on:scanned_uid_not_found={handle_scanned_uid_not_found}

  on:nfc_off={handle_nfc_off}
/>

<style>
h1 {
  font-size: 3em;
}
h2 {
  font-size: 1.8em;
}
p {
  font-size: 1.4em;
}
span {
  font-size: 1.3em;
}
</style>
