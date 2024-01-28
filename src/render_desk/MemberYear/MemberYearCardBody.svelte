<script>
  import { focus_year } from '../../services/store';
  import { member_year_person_map } from '../../services/store';
  import { Button, CardBody } from 'sveltestrap';
  import MemberYearModal from './MemberYearModal.svelte';

  let open_member_year_modal;

</script>

<MemberYearModal bind:open_member_year_modal />

<CardBody>
  <div>
    <Button
      size=sm
      color=white
      outline
      on:click={open_member_year_modal}
    >
      {$member_year_person_map.get('y' + $focus_year)?.size ?? '-'}
    </Button>
      leden in
    <Button
        size=sm
        color=success
        title="aantal leden in {$focus_year}"
        on:click={open_member_year_modal}
    >
      {$focus_year}
    </Button>
  </div>
</CardBody>
