<script>
  import { Card, CardBody, Col } from 'sveltestrap';
  import ManualInput from '../ManualInput/ManualInput.svelte';
  import Person from '../Person/Person.svelte';
  import RegList from '../Reg/RegList.svelte';
  import TemperatureCard from '../../Common/TemperatureCard.svelte';
  import Clock from '../../Common/Clock.svelte';
  import SyncBadge from '../../Common/SyncBadge.svelte';
  import DeskPageLinks from './DeskPageLinks.svelte';
  import NfcCard from '../Nfc/NfcCard.svelte';
  import TagCard from '../Tag/TagCard.svelte';
  import GateCard from '../Gate/GateCard.svelte';
  import { temperature_card_enabled } from '../../services/store';
  import { desk_gate_card_enabled } from '../../services/store';
  import { desk_tag_card_enabled } from '../../services/store';
  import MemberPeriodCardBody from '../MemberPeriod/MemberPeriodCardBody.svelte';

</script>

<Col md=9 class=min-vh-100>
  <ManualInput />
  <Person />
  <RegList />
</Col>

<Col class="bg-primary min-vh-100">
  <NfcCard />

  {#if $desk_tag_card_enabled}
    <TagCard />
  {/if}

  {#if $desk_gate_card_enabled}
    <GateCard />
  {/if}

  {#if $temperature_card_enabled}
    <TemperatureCard horizontal />
  {/if}

  <div class=my-2>
    <Card>
      <MemberPeriodCardBody />
      <CardBody class="d-flex w-100 justify-content-between">
        <SyncBadge />
        <Clock />
      </CardBody>
    </Card>
  </div>

  <div class=my-2>
    <DeskPageLinks />
  </div>
</Col>
