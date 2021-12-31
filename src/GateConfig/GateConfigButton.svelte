<script>
  const { env } = window.require('electron').remote.process;
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = new createEventDispatcher();
  let handle_click_open_gate_config;

  let config_auth = false;
  let deblock_auth = false;

  const env_gate_config_auth = env.GATE_CONFIG_AUTH;
  const env_gate_deblock_auth = env.GATE_DEBLOCK_AUTH;

  export let person;
  export let nfc_uid;

  onMount(() => {
    handle_click_open_gate_config = () => {
      dispatch('click_open_gate_config', {
        person: person,
        nfc_uid: nfc_uid,
        config_auth: config_auth,
        deblock_auth: deblock_auth
      });
    };
  });

  const set_auth = () => {
    config_auth = false;
    deblock_auth = false;

    if (!nfc_uid || !person){
      return;
    }

    let person_role_ary = [];
    if (person.group){
      person_role_ary = person.group.split(',');
    }
    person_role_ary = [...person_role_ary, person.member_id];

    let split_gate_config_auth = [];
    if (typeof env_gate_config_auth === 'string'){
      split_gate_config_auth = env_gate_config_auth.split(',');
    }
    let gate_config_auth_ary = [];
    for(let gca of split_gate_config_auth){
      gate_config_auth_ary = [...gate_config_auth_ary, gca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '')];
    }

    let split_gate_deblock_auth = [];
    if (typeof env_gate_deblock_auth === 'string'){
      split_gate_deblock_auth = env_gate_deblock_auth.split(',');
    }
    let gate_deblock_auth_ary = [];
    for(let gda of split_gate_deblock_auth){
      gate_deblock_auth_ary = [...gate_deblock_auth_ary, gda.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '')];
    }

    for (let person_role of person_role_ary){
      let person_role_norm = person_role.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');

      if (config_auth && deblock_auth){
        break;
      }

      for (let gate_config_auth of gate_config_auth_ary){
        if (person_role_norm.trim() === gate_config_auth.trim()){
          config_auth = true;
          break;
        }
      }

      for (let gate_deblock_auth of gate_deblock_auth_ary){
        if (person_role_norm.trim() === gate_deblock_auth.trim()){
          deblock_auth = true;
          break;
        }
      }
    }
  }

  $: if (nfc_uid && person){
    set_auth();
  }
</script>

{#if person && nfc_uid && (config_auth || deblock_auth)}
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
