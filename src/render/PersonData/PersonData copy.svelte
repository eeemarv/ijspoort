<script>
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { get_person_count_by_simular } from '../services/person_simular';

  ////

  import { person_map } from '../services/store';
  import { selected_person_id } from '../services/store';

/////

  import { tag_display_enabled } from '../services/store';
  import PersonName from '../Person/PersonName.svelte';
  import PersonMemberId from '../Person/PersonMemberId.svelte';
  import PersonMemberYear from '../Person/PersonMemberYear.svelte';
  import PersonTagList from '../Person/PersonTagList.svelte';
  import PersonNfcList from '../Person/PersonNfcList.svelte';
  import PersonRegList from '../Person/PersonRegList.svelte';
  import PersonRegButton from '../Person/PersonRegButton.svelte';
  import PersonSimularButton from '../Person/PersonSimularButton.svelte';
  import PersonSimularModal from '../Person/PersonSimularModal.svelte';
    import AwaitError from '../Common/AwaitError.svelte';

  const dispatch = createEventDispatcher();

  let group_ary = [];
  let person = undefined;
  let person_id = undefined;

  let open_reg_list;
  let open_simular;

  $:  {
    if ($selected_person_id){
      person_id = $selected_person_id;
      person = $person_map.get(person_id) ?? {};
      if (person.group !== undefined && person.group !== ''){
        group_ary = person.group.split(',');
      }
    } else {
      person = undefined;
      person_id = undefined;
      group_ary = [];
    }
  }

  const handle_click_manual_reg = (() => {
    dispatch('click_manual_reg');
  });
</script>

    {#await get_person_count_by_simular(person_id) then simular_map}
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
      <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div>
            <PersonName {person_id} />
          </div>
          <PersonSimularButton
            key=name
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
      </ListGroupItem>

      {#if person.gender || person.date_of_birth}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div>
          {#if person.gender === 'm'}
            <span class="badge bg-info" title="man">
              M
            </span>
            &nbsp;
          {/if}
          {#if person.gender === 'f'}
            <span class="badge bg-danger" title="vrouw">
              V
            </span>
            &nbsp;
          {/if}
          {#if person.date_of_birth}
            <span title="geboortedatum">
              {person.date_of_birth}
            </span>
          {/if}
          </div>
          <PersonSimularButton
            key=date_of_birth
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
        </ListGroupItem>
      {/if}

      {#if person.phone_mobile}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="gsm">
            {person.phone_mobile}
            &nbsp;
            <Badge color=primary>
              GSM
            </Badge>
          </div>

          <div>
            <PersonSimularButton
              key=phone_mobile
              {simular_map} {person_id}
              on:click_simular={open_simular}
            />
          </div>
        </ListGroupItem>
      {/if}

      {#if person.phone_home}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="telefoon thuis">
            {person.phone_home}
            &nbsp;
            <Badge color=primary>
              Tel.thuis
            </Badge>
          </div>
          <div>
            <PersonSimularButton
              key=phone_home
              {simular_map} {person_id}
              on:click_simular={open_simular}
            />
          </div>
        </ListGroupItem>
      {/if}

      {#if person.phone_work}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="telefoon werk">
            {person.phone_work}
            &nbsp;
            <Button color=primary>
              Tel.werk
            </Button>
          </div>
          <idv>
            <PersonSimularButton
              key=phone_work
              {simular_map} {person_id}
              on:click_simular={open_simular}
            />
          </idv>
        </ListGroupItem>
      {/if}

      {#if person.email}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="email">{person.email}</div>
          <PersonSimularButton
            key=email
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
        </ListGroupItem>
      {/if}

      {#if person.address || person.address_zipcode || person.address_municipality}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div>
          {#if person.address}
            <div title="straat en nummer">
              {person.address}
            </div>
          {/if}
          {#if person.address_zipcode || person.address_municipality}
            <div>
              {#if person.address_zipcode}
              <span title="postcode">
                {person.address_zipcode}
              </span>&nbsp;
              {/if}
              {#if person.address_municipality}
              <span title="geneente">
                {person.address_municipality}
              </span>
              {/if}
            </div>
          {/if}
          </div>
          <PersonSimularButton
            key=address
            {simular_map} {person_id}
            on:click_simular={open_simular}
          />
        </ListGroupItem>
      {/if}

      {#each group_ary as group}
        <ListGroupItem title="werkgroep" class="d-flex w-100 justify-content-between py-2 bg-info">
          <div title="werkgroep">{group}</div>
          <PersonSimularButton
            key=group
            {group} {simular_map} {person_id}
            on:click_simular={open_simular}
          />
        </ListGroupItem>
      {/each}

      {#if person.team}
        <ListGroupItem title="ploeg" class="py-2 bg-primary">
          {person.team}
        </ListGroupItem>
      {/if}

    </ListGroup>
    {:catch error}
      <AwaitError {error} />
    {/await}
