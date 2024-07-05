<script>
  const env = window.require('electron').remote.process.env;
  import DeskContainer from '../../render_desk/Desk/DeskContainer.svelte';
  import GatePage from '../../render_gate/Gate/GatePage.svelte';
  import AppInit from './AppInit.svelte';
  import { listen_nfc } from '../../nfc/nfc_scan';
  import { listen_nfc_device } from '../../nfc/nfc_device';
  import { listen_gate_open } from '../../gate/gate_monitor';
  import { member_period_filter } from '../../services/store';
  import { member_period_select } from '../../services/store';
  import { member_data_update } from '../../services/store';
  import { member_person_map } from '../../services/store';

  listen_nfc();
  listen_nfc_device();
  listen_gate_open();

  $: if (!$member_data_update && !$member_person_map.has($member_period_filter)){
    $member_period_filter = '';
  }
  $: if (!$member_data_update && !$member_person_map.has($member_period_select)){
    $member_period_select = '';
  }

</script>

<AppInit />

{#if env.GATE === '1'}
  <GatePage />
{:else}
  <DeskContainer />
{/if}
