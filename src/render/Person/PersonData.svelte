<script>
  import { Button } from 'sveltestrap';
  import { ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { person_map } from '../services/store';
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import PersonListItemBetween from './PersonListItemBetween.svelte';

  export let person_id = undefined;

  $: person = person_id ? ($person_map.get(person_id) ?? {}) : undefined;
  $: group_ary = person_id && person && person.group ? person.group.split(',') : [];

</script>

<PersonListItemBetween>
  <PersonMemberId {person_id} slot=left />
  <span title="inschrijvingsdatum" slot=right>
    {person?.member_since}
  </span>
</PersonListItemBetween>

<!--
<PersonListItemBetween>
  <PersonName slot=left {person_id} />
  <slot slot=right name=simular />
</PersonListItemBetween>
-->

<PersonListItemBetween>
  <PersonName {person_id} slot=left />
  <slot name=simular key=name slot=right />
</PersonListItemBetween>

{#if person.gender || person.date_of_birth}
<PersonListItemBetween>
    <div slot=left>
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
    <slot name=simular key=date_of_birth slot=right />
</PersonListItemBetween>
{/if}

{#if person.phone_mobile}
  <PersonListItemBetween>
    <div title="gsm" slot=left>
      {person.phone_mobile}
      &nbsp;
      <Badge color=primary>
        GSM
      </Badge>
    </div>
    <slot name=simular key=phone_mobile slot=right />
  </PersonListItemBetween>
{/if}

{#if person.phone_home}
  <PersonListItemBetween>
    <div title="telefoon thuis" slot=left>
      {person.phone_home}
      &nbsp;
      <Badge color=primary>
        Tel.thuis
      </Badge>
    </div>
    <slot name=simular key=phone_home slot=right />
  </PersonListItemBetween>
{/if}

{#if person.phone_work}
  <PersonListItemBetween>
    <div title="telefoon werk" slot=left>
      {person.phone_work}
      &nbsp;
      <Button color=primary>
        Tel.werk
      </Button>
    </div>
    <slot name=simular key=phone_work slot=right />
  </PersonListItemBetween>
{/if}

{#if person.email}
  <PersonListItemBetween>
    <div title="email" slot=left>
      {person.email}
    </div>
    <slot name=simular key=email slot=right />
  </PersonListItemBetween>
{/if}

{#if person.address || person.address_zipcode || person.address_municipality}
  <PersonListItemBetween>
    <div slot=left>
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
    <slot name=simular key=address slot=right />
  </PersonListItemBetween>
{/if}

{#each group_ary as group}
  <PersonListItemBetween>
    <div title="werkgroep" slot=left>
      {group}
    </div>
    <slot name=simular key=group {group} slot=right />
  </PersonListItemBetween>
{/each}

{#if person.team}
  <ListGroupItem title="ploeg" class="py-2 bg-primary">
    {person.team}
  </ListGroupItem>
{/if}

<slot name=error />
