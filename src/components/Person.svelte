<script>
  const { ipcRenderer } = window.require('electron');
  import { Card, CardHeader, CardBody, CardFooter, CardGroup, Popover, Tooltip } from 'sveltestrap';
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { xls_assist_import } from './../services/person';
  import { person, person_nfc_list } from './../services/store';
  import PersonNfc from './PersonNfc.svelte';
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import PersonRegLog from './PersonRegLog.svelte';
  import PersonMemberYear from './PersonMemberYear.svelte';
  import PersonSearchSimular from './PersonSearchSimular.svelte';

  ipcRenderer.on('xls.assist.import', (ev, file, assist_import) => {
    if (!assist_import.enabled){
      return;
    }
    xls_assist_import(file, assist_import);
  });

  const dispatch = createEventDispatcher();

  $: {
    if ($person === undefined){
      $person_nfc_list = [];
    } else {
      console.log($person);
    }
  }

  const handle_register = (() => {
    dispatch('register');
  });
</script>

{#if $person}

<CardGroup>
  <Card>
    <CardHeader class=bg-info>
      Assist
    </CardHeader>
    <ListGroup>
      <ListGroupItem class="d-flex w-100 justify-content-between py-2">
        <PersonMemberId member_id={$person.member_id} />
        {#if $person.member_since }
          <div title="inschrijvingsdatum">{$person.member_since}</div>
        {:else}
          <div></div>
        {/if}
      </ListGroupItem>

      <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div>
            <PersonName person={$person} />
          </div>
          <PersonSearchSimular type=name />
      </ListGroupItem>

      {#if $person.gender || $person.date_of_birth}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div>
          {#if $person.gender === 'm'}
            <Badge color=info title=man>M</Badge>
            &nbsp;
          {/if}
          {#if $person.gender === 'f'}
            <Badge color=danger title=vrouw>V</Badge>
            &nbsp;
          {/if}
          {#if $person.date_of_birth}
            <span title="geboortedatum">{$person.date_of_birth}</span>
          {/if}
          </div>
          <PersonSearchSimular type=date_of_birth />
        </ListGroupItem>
      {/if}

      {#if $person.phone_mobile}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="gsm">
            {$person.phone_mobile}
            &nbsp;
            <Badge color=primary>
              GSM
            </Badge>
          </div>

          <div>
            <PersonSearchSimular type=phone_mobile />
          </div>
        </ListGroupItem>
      {/if}

      {#if $person.phone_home}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="telefoon thuis">
            {$person.phone_home}
            &nbsp;
            <Badge color=primary>
              Tel.thuis
            </Badge>
          </div>
          <div>
            <PersonSearchSimular type=phone_home />
          </div>
        </ListGroupItem>
      {/if}

      {#if $person.phone_work}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="telefoon werk">
            {$person.phone_work}
            &nbsp;
            <Button color=primary>Tel.werk</Button>
          </div>
          <idv>
            <PersonSearchSimular type=phone_work />
          </idv>
        </ListGroupItem>
      {/if}

      {#if $person.email}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="email">{$person.email}</div>
          <PersonSearchSimular type=email />
        </ListGroupItem>
      {/if}

      {#if $person.address || $person.address_zipcode || $person.address_municipality}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div>
          {#if $person.address}
            <div title="straat en nummer">
              {$person.address}
            </div>
          {/if}
          {#if $person.address_zipcode || $person.address_municipality}
            <div>
              {#if $person.address_zipcode}
              <span title="postcode">
                {$person.address_zipcode}
              </span>&nbsp;
              {/if}
              {#if $person.address_municipality}
              <span title="geneente">
                {$person.address_municipality}
              </span>
              {/if}
            </div>
          {/if}
          </div>
          <PersonSearchSimular type=address />
        </ListGroupItem>
      {/if}

      {#if $person.group}
        <ListGroupItem title="werkgroep" class="py-2 bg-info">
          {$person.group}
        </ListGroupItem>
      {/if}

      {#if $person.team}
        <ListGroupItem title="ploeg" class="py-2 bg-primary">
          {$person.team}
        </ListGroupItem>
      {/if}

    </ListGroup>
    <CardFooter>
      <PersonMemberYear />
    </CardFooter>
  </Card>

  <Card>
    <CardHeader class=bg-info>
      Gelinkte data
    </CardHeader>
    <PersonNfc />
    <CardBody>
      <PersonRegLog />
    </CardBody>
    <div class="card-footer d-flex w-100 justify-content-end">
      <Button color=dark class=ml-3 on:click={() => $person = undefined}>
        Sluiten
      </Button>
      <Button color=primary class=ml-3 on:click={handle_register}>
        Registreer
      </Button>
    </div>
  </Card>
</CardGroup>
{/if}
