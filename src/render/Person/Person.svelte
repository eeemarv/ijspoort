<script>
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import { ListGroup } from 'sveltestrap';
  import { get_person_count_by_simular } from './../services/person_simular';

  ////

  import { selected_person_id } from './../services/store';

/////

  import { tag_display_enabled } from './../services/store';
  import PersonMemberYear from './PersonMemberYear.svelte';
  import PersonTagList from './PersonTagList.svelte';
  import PersonNfcList from './PersonNfcList.svelte';
  import PersonRegList from './PersonRegList.svelte';
  import PersonRegButton from './PersonRegButton.svelte';
  import PersonSimularButton from './PersonSimularButton.svelte';
  import PersonSimularModal from './PersonSimularModal.svelte';
  import AwaitError from '../Common/AwaitError.svelte';
  import PersonData from './PersonData.svelte';
  import AwaitLabel from '../Common/AwaitLabel.svelte';

  const dispatch = createEventDispatcher();

  let open_reg_list;
  let open_simular;

  $: person_id = $selected_person_id;

  const handle_click_manual_reg = (() => {
    dispatch('click_manual_reg');
  });
</script>

{#if person_id}

<PersonSimularModal bind:open_simular {person_id} />
<PersonRegList bind:open_reg_list {person_id}/>

<CardGroup>
  <Card>
    <CardHeader class=bg-info>
      Assist
    </CardHeader>

    <ListGroup>
      <PersonData {person_id}>
        {#await get_person_count_by_simular(person_id)}
          <AwaitLabel slot=simular />
        {:then simular_map}
          <PersonSimularButton {simular_map} {person_id} slot=simular />
        {:catch error}
          <AwaitError {error} slot=error />
        {/await}
      </PersonData>
    </ListGroup>

    <CardBody></CardBody>
    <CardFooter>
      <PersonMemberYear {person_id} />
    </CardFooter>
  </Card>

  <Card>
    <CardHeader class=bg-info>
      Gelinkte data
    </CardHeader>
    <ListGroup>
    <PersonNfcList {person_id} />
    <PersonRegButton
      {person_id}
      on:click={open_reg_list}
    />
    {#if $tag_display_enabled}
      <PersonTagList {person_id} />
    {/if}
    </ListGroup>
    <CardBody>
    </CardBody>
    <div class="card-footer d-flex w-100 justify-content-between">
      <Button
        color=warning
        on:click={handle_click_manual_reg}
        title="Registratie zonder tag!"
      >
        Registreer Manueel &#9888;
      </Button>
      <Button
        color=primary
        class=ms-3
        on:click={() => $selected_person_id = undefined}
      >
        Sluiten
      </Button>
    </div>
  </Card>
</CardGroup>
{/if}
