<script>
  import { Button } from 'sveltestrap';
  import { ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { person_map } from '../../services/store';
  import PersonName from './PersonName.svelte';
  import AwaitBadge from '../../render/Await/AwaitBadge.svelte';

  export let person_id = undefined;

  $: person = $person_map.get(person_id) ?? {};
</script>

{#if person_id}
  <ListGroupItem class="d-flex w-100 justify-content-between py-2">
      <div>
        <PersonName {person_id} />
      </div>
      <slot name=name>
        <AwaitBadge />
      </slot>
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
      <slot name=date_of_birth>
        <AwaitBadge />
      </slot>
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
        <slot name=phone_mobile>
          <AwaitBadge />
        </slot>
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
        <slot name=phone_home>
          <AwaitBadge />
        </slot>
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
        <slot name=phone_work>
          <AwaitBadge />
        </slot>
      </idv>
    </ListGroupItem>
  {/if}

  {#if person.email}
    <ListGroupItem class="d-flex w-100 justify-content-between py-2">
      <div title="email">
        {person.email}
      </div>
      <slot name=email>
        <AwaitBadge />
      </slot>
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
      <slot name=address>
        <AwaitBadge />
      </slot>
    </ListGroupItem>
  {/if}
  <slot name=groups>
    {#if person.group}
      {#each person.group.split(',') as group}
        <ListGroupItem title="werkgroep" class="d-flex w-100 justify-content-between py-2 bg-info">
          <div title="werkgroep">
            {group}
          </div>
          <AwaitBadge />
        </ListGroupItem>
      {/each}
    {/if}
  </slot>
  {#if person.team}
    <ListGroupItem title="ploeg" class="py-2 bg-primary">
      {person.team}
    </ListGroupItem>
  {/if}
{/if}

