<script>
  import { Card, CardBody, Col } from 'sveltestrap';
  import ManualInput from '../ManualInput/ManualInput.svelte';
  import Person from '../Person/Person.svelte';
  import RegList from '../Reg/RegList.svelte';
  import TemperatureCard from '../../render/Common/TemperatureCard.svelte';
  import Clock from '../../render/Common/Clock.svelte';
  import SyncBadge from '../../render/Common/SyncBadge.svelte';
  import DeskPageLinks from './DeskPageLinks.svelte';
  import NfcCard from '../Nfc/NfcCard.svelte';
  import TagCard from '../Tag/TagCard.svelte';
  import GateCard from '../Gate/GateCard.svelte';
  import { temp_display_enabled } from '../../services/store';
  import { gate_display_enabled } from '../../services/store';
  import { tag_display_enabled } from '../../services/store';
  import MemberYearCardBody from '../MemberYear/MemberYearCardBody.svelte';

</script>

<Col md=9 class=min-vh-100>
  <ManualInput />
  <Person />
  <RegList />
</Col>

<Col class="bg-primary min-vh-100">
  <NfcCard />

  {#if $tag_display_enabled}
    <TagCard />
  {/if}

  {#if $gate_display_enabled}
    <GateCard />
  {/if}

  {#if $temp_display_enabled}
    <TemperatureCard horizontal />
  {/if}

  <div class=my-2>
    <Card>
      <MemberYearCardBody />
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
