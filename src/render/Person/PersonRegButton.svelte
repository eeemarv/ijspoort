<script>
  import { Button, ListGroupItem } from 'sveltestrap';
  import { get_reg_count_by_person_id } from '../services/reg';
  import AwaitBadge from '../Await/AwaitBadge.svelte';

  export let person_id;

</script>

<ListGroupItem>
  {#await get_reg_count_by_person_id(person_id)}
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
