<script>
  const env = window.require('electron').remote.process.env;
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = new createEventDispatcher();
  let handle_click_open_gate_config;
  let btn_enabled;
  let gate_admin_ary = [];
  const env_gate_admin = env.GATE_ADMIN;

  export let person;
  export let nfc_uid;

  onMount(() => {
    let split_gate_admin = env_gate_admin.split(',');
    gate_admin_ary = [];
    for(const v of split_gate_admin){
      gate_admin_ary = [...gate_admin_ary, v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '')];
    }

    handle_click_open_gate_config = () => {
      dispatch('click_open_gate_config', {
        person: person,
        nfc_uid: nfc_uid
      });
    };
  });

  $: if (nfc_uid && person && person.group && person.group.trim() !== ''){
    btn_enabled = false;
    let split_group = person.group.split(',');
    outer_loop: for (const a of split_group){
      let a_norm = a.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
      for (const b of gate_admin_ary){
        if (a_norm.trim() === b.trim()){
          btn_enabled = true;
          break outer_loop;
        }
      }
    }
  } else {
    btn_enabled = false;
  }

  $: if (!person){
    btn_enabled = false;
  }
</script>

{#if person && nfc_uid && btn_enabled}
  <button type=button class="btn btn-primary btn-lg"
    on:click={handle_click_open_gate_config}
  >
    Instellingen
  </button>
{/if}

<style>
button {
  font-size: 1.6em;
}
</style>
