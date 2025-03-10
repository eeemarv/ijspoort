<script>
  import { Button } from '@sveltestrap/sveltestrap';
  import { reg_get_count_by_person_id } from '../../../db_get/reg_get';
  import AwaitBadge from '../../Await/AwaitBadge.svelte';
  import ListGroupItem from '../../Common/ListGroupItem.svelte';

  export let person_id;

</script>

<ListGroupItem>
  {#await reg_get_count_by_person_id(person_id, true, true)}
    <AwaitBadge text="...data ophalen" />
  {:then reg_count}
    <Button
      disabled={reg_count === 0}
      color=primary
      on:click
      title="Bekijk registraties (totaal: {reg_count})"
    >
      Registraties {reg_count}
    </Button>
  {:catch err}
    <p class="text-danger">{err}</p>
  {/await}
</ListGroupItem>
