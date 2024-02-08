<script>
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { person_get_count_by_simular } from '../../db_get/person_get';
  import { person_map } from '../../services/store';
  import { selected_person_id } from '../../services/store';
  import { tag_display_enabled } from '../../services/store';
  import PersonMemberId from '../../render/Person/PersonMemberId.svelte';
  import PersonMemberYearList from './PersonMemberYearList.svelte';
  import PersonTagList from './PersonTagList.svelte';
  import PersonNfcList from './PersonNfcList.svelte';
  import PersonRegList from './PersonRegList.svelte';
  import PersonRegButton from './PersonRegButton.svelte';
  import PersonSimularButton from './PersonSimularButton.svelte';
  import PersonSimularModal from './PersonSimularModal.svelte';
  import PersonData from './PersonData.svelte';
  import { reg_add_by_desk_manual } from '../../db_put/reg_put';
  import { person_last_reg_ts_map } from '../../services/store';
  import { get_time_str } from '../../services/functions';
  import { person_is_already_registered } from '../../person/person_already_registered';

  let open_reg_list;
  let open_simular;
  let refresh_switch = false;

  $: person_id = $selected_person_id;
  $: person = $person_map.get(person_id) ?? {};
  $: already_registered = person_is_already_registered(person_id, refresh_switch);

  setInterval(() => {
    refresh_switch = !refresh_switch;
  }, 5000);

  const handle_manual_reg = (() => {
    reg_add_by_desk_manual(person_id);
    $selected_person_id = undefined;
  });

  $: if ($selected_person_id){
    console.log('selected_person_id', $selected_person_id);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
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
      <ListGroupItem class="d-flex w-100 justify-content-between py-2">
        <PersonMemberId {person_id} />
        {#if person.member_since }
          <div title="inschrijvingsdatum">
            {person.member_since}
          </div>
        {:else}
          <div></div>
        {/if}
      </ListGroupItem>
      {#await person_get_count_by_simular(person_id)}
        <PersonData {person_id} />
      {:then simular_map}
        <PersonData {person_id}>
          <PersonSimularButton
            slot=name
            key=name
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
          <PersonSimularButton
            key=date_of_birth
            slot=date_of_birth
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
          <PersonSimularButton
            key=phone_mobile
            slot=phone_mobile
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
          <PersonSimularButton
            key=phone_home
            slot=phone_home
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
          <PersonSimularButton
            key=phone_work
            slot=phone_work
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
          <PersonSimularButton
            key=email
            slot=email
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
          <PersonSimularButton
            key=address
            slot=address
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
          <svelte:fragment slot=groups>
          {#if person.group}
            {#each person.group.split(',') as group}
              <ListGroupItem title="werkgroep" class="d-flex w-100 justify-content-between py-2 bg-info">
                <div title="werkgroep">
                  {group}
                </div>
                <PersonSimularButton
                  key=group
                  {group} {simular_map} {person_id}
                  on:click_simular={open_simular}
                />
              </ListGroupItem>
            {/each}
          {/if}
          </svelte:fragment>
        </PersonData>
      {:catch err}
        <p class="text-danger">{err}</p>
      {/await}
    </ListGroup>
    <CardBody></CardBody>
    <CardFooter>
      <PersonMemberYearList {person_id} />
    </CardFooter>
  </Card>

  <Card>
    <CardHeader class=bg-info>
      Gekoppelde data
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
      {#if already_registered}
        <Button color=danger
          disabled
        >
          Geregistreerd {get_time_str($person_last_reg_ts_map.get(person_id))}          
        </Button>
      {:else}
        <Button
          color=warning
          on:click={handle_manual_reg}
          title="Registratie zonder tag!"
        >
          Registreer Manueel &#9888;
        </Button>
      {/if}
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
