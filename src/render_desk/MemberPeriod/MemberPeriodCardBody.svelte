<script>
  import { member_period_filter } from '../../services/store';
  import { member_person_map } from '../../services/store';
  import { Button, CardBody } from 'sveltestrap';
  import MemberPeriodModal from './MemberPeriodModal.svelte';

  let open_member_period_modal;

</script>

<MemberPeriodModal bind:open_member_period_modal />

<CardBody>
  <div>
    <Button
      size=sm
      color=white
      outline
      on:click={open_member_period_modal}
    >
      {$member_person_map.get($member_period_filter)?.size ?? '-'}
    </Button>
      leden in
    <Button
        size=sm
        color=success
        title="aantal leden in {$member_period_filter}"
        on:click={open_member_period_modal}
    >
      {#if $member_period_filter}
        {$member_period_filter}
      {:else}
        ***
      {/if}
    </Button>
  </div>
</CardBody>
