<script>
  const { ipcRenderer } = window.require('electron');
  import { Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
  import PersonTag from '../../render/Person/PersonTag.svelte';
  import GateConfig from '../GateConfig/GateConfig.svelte';
  import { get_time_str } from '../../services/functions';
  import { sub_gate_count } from '../../services/sub';
  import { sub_gate_count_enabled } from '../../services/sub';
  import { sub_gate_nfc_enabled } from '../../services/sub';
  import { sub_nfc_map } from '../../services/sub';
  import { sub_person_last_reg_ts_map } from '../../services/sub';
  import { reg_block_time } from '../../db_put/reg_put';
  import GateModalPersonMemberYearList from './GateModalPersonMemberYearList.svelte';
  import { sub_gate_open } from '../../services/sub';
  import { sound_ok } from '../../services/sound';
  import { sound_error } from '../../services/sound';
  import { ev_nfc_scan } from '../../services/events';
  import { get_nfc_id_that_opened_gate } from '../../gate/gate_trigger';
  import { gate_auth } from '../../gate/gate_auth';

  let open_gate_config = () => {};
  let close_gate_config = () => {};

  let open_down_count = 0;
  const open_start_count = 50;
  const open_count_interval_time = 100;
  
  let message = undefined;
  let color = 'primary';
  let person_id = undefined;
  let already_registered_person_id = undefined;
  let gate_auth_person_id = undefined;
  
  $: gate_auth_enabled = gate_auth(gate_auth_person_id);

  let time = (new Date()).getTime();
  setInterval(() => {
    time = (new Date()).getTime();
  }, 1000);

  setInterval(() => {
    if (open_down_count){
      open_down_count = open_down_count - 1;
    }
  }, open_count_interval_time);

  const toggle = () => {
    if (open_down_count){
      open_down_count = 0;
      return;
    }
    open_down_count = open_start_count;
  };

  const handle_open_gate_config = () => {
    open_down_count = 0;
    open_gate_config();
  };

  const msgs = {
    wait: {
      msg: 'Wacht even tot je voorganger door de poort is en probeer opnieuw.',
      color: 'purple',
      person: false,
      gate_auth: true
    },
    full: {
      msg: 'Volzet',
      color: 'purple',
      person: true,
      gate_auth: true
    },
    person_valid_member: {
      msg: 'Ok',
      color: 'success',
      person: true,
      open_gate: true,
      gate_auth: true
    },
    person_not_member: {
      msg: 'Lidmaatschap niet in orde',
      color: 'purple',
      person: true,
      gate_auth: false
    },
    nfc_not_found: {
      msg: 'Tag niet herkend',
      color: 'danger',
      person: false,
      gate_auth: false
    },
    person_not_found: {
      msg: 'Geen personsdata gevonden',
      color: 'danger',
      person: false,
      gate_auth: false
    },
    nfc_blocked: {
      msg: 'Tag geblokkeerd',
      color: 'purple',
      person: true,
      gate_auth: false
    },
    person_already_registered: {}
  };

  const launch_modal = (ev_name, nfc_id = undefined, prsn_id = undefined) => {
    ipcRenderer.send('scan.gate.' + ev_name, nfc_id);
    const d = msgs[ev_name];
    message = d.msg;
    color = d.color;
    if (d.person){
      person_id = prsn_id;
    } else {
      person_id = undefined;
      already_registered_person_id = undefined;
    }
    if (d.gate_auth){
      gate_auth_person_id = prsn_id;
    } else {
      gate_auth_person_id = undefined;
    }
    open_down_count = open_start_count;
    if (typeof d.open_gate === 'boolean' && d.open_gate){
      sound_ok();
      ev_nfc_scan.dispatchEvent(new CustomEvent('gate_open_trigger', {
        detail: {nfc_id}
      }));
      return;
    }
    sound_error();
  };

  const process_ev_nfc_scan = (ev_name, nfc_id) => {
    let prsn_id = undefined;
    if (typeof nfc_id === 'string'
      && sub_nfc_map.has(nfc_id)){
        prsn_id = sub_nfc_map.get(nfc_id).person_id;
    }
    if (ev_name === 'person_already_registered'){
      already_registered_person_id = prsn_id;
      ipcRenderer.send('scan.gate.person_already_registered', nfc_id);   
      return;
    }
    close_gate_config();

    if (sub_gate_open && sub_gate_nfc_enabled){
      const og_nfc_id = get_nfc_id_that_opened_gate();
      if (typeof og_nfc_id === 'string'
        && (typeof prsn_id === 'undefined'
          || prsn_id !== sub_nfc_map.get(og_nfc_id).person 
      )){
        launch_modal('wait', nfc_id, prsn_id);
        return;
      }
    }

    if (ev_name === 'person_valid_member'
      && sub_gate_count_enabled 
      && (sub_gate_count <= 0
    )){
      launch_modal('full', nfc_id, prsn_id);
      return;
    }
    launch_modal(ev_name, nfc_id, prsn_id);
  };

  for (const ev_name in msgs){
    if (ev_name === 'wait'){
      continue;
    }
    if (ev_name === 'full'){
      continue;
    }
    console.log('..GateModal ev_nfc_scan listen ' + ev_name);
    ev_nfc_scan.addEventListener(ev_name, (e) => {
      console.log('..GateModal ev_nfc_scah ' + ev_name + ' ' + e.detail.nfc_id);
      process_ev_nfc_scan(ev_name, e.detail.nfc_id ?? undefined);
    });
  }

</script>

<GateConfig 
  bind:open_gate_config
  bind:close_gate_config
/>

<Modal
  isOpen={open_down_count}
  {toggle}
  fullscreen
  fade={false}
  contentClassName="bg-{color}"
>
  <ModalHeader {toggle}>
    <h1>{message}</h1>
  </ModalHeader>
  {#if person_id}
    <ModalBody>
      <h2>
        <PersonTag {person_id} />
      </h2>
      {#if typeof already_registered_person_id === 'string'
        && already_registered_person_id === person_id
        && sub_person_last_reg_ts_map.has(person_id)
        && sub_person_last_reg_ts_map.get(person_id) > (time - reg_block_time)
      }
        <p>
          Reeds geregistreerd om {get_time_str(sub_person_last_reg_ts_map.get(person_id))}
        </p>
      {/if}
    </ModalBody>
  {/if}
  {#if person_id || gate_auth_enabled}
    <ModalFooter>
      <div class="d-flex w-100 justify-content-between">
        <div>
          {#if person_id}
            <GateModalPersonMemberYearList {person_id} />
          {/if}
        </div>
        <div>
          {#if gate_auth_enabled}
            <button type=button class="btn btn-primary btn-lg"
              on:click={handle_open_gate_config}
            >
              Instellingen
            </button>
          {/if}
        </div>
      </div>
    </ModalFooter>
  {/if}
</Modal>

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
button {
  font-size: 1.6em;
}
</style>
