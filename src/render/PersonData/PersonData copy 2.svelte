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
  import AwaitLabel from '../Common/AwaitLabel.svelte';
  import PersonListItemBetween from '../Person/PersonListItemBetween.svelte';

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

</script>

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

<!--
<PersonListItemBetween>
  <PersonName slot=left {person_id} />
  <slot slot=right name=simular />
</PersonListItemBetween>
-->

<ListGroupItem class="d-flex w-100 justify-content-between py-2">
    <div>
      <PersonName {person_id} />
    </div>
    <div>
      <slot name=simular key=name />
    </div>
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
    <div>
      <slot name=simular key=date_of_birth />
    </div>
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
      <slot name=simular key=phone_mobile />
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
      <slot name=simular key=phone_home />
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
    <div>
      <slot name=simular key=phone_work />
    </div>
  </ListGroupItem>
{/if}

{#if person.email}
  <ListGroupItem class="d-flex w-100 justify-content-between py-2">
    <div title="email">
      {person.email}
    </div>
    <div>
      <slot name=simular key=email />
    </div>
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
    <div>
      <slot name=simular key=address />
    </div>
  </ListGroupItem>
{/if}

{#each group_ary as group}
  <ListGroupItem title="werkgroep" class="d-flex w-100 justify-content-between py-2 bg-info">
    <div title="werkgroep">
      {group}
    </div>
    <div>
      <slot name=simular key=group {group} />
    </div>
  </ListGroupItem>
{/each}

{#if person.team}
  <ListGroupItem title="ploeg" class="py-2 bg-primary">
    {person.team}
  </ListGroupItem>
{/if}
