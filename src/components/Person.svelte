<script>
  const { ipcRenderer } = window.require('electron');
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { xls_assist_import } from './../services/person';
  import { person, person_nfc_list } from './../services/store';
  import PersonNFC from './PersonNFC.svelte';
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import PersonRegLog from './PersonRegLog.svelte';

  ipcRenderer.on('xls.assist.import', (ev, file) => {
    xls_assist_import(file);
  });

  const dispatch = createEventDispatcher();

  $: member_2021 = $person !== undefined
    && $person.open_balance !== undefined
    && !$person.open_balance.trim().startsWith('-');

  $: {
    if ($person === undefined){
      $person_nfc_list = [];
    } else {
      console.log($person);
    }
  }

  const handleRegisterByManual = (() => {
    dispatch('register_by_manual');
  });
  const handleAddComment = ((event) => {
    dispatch('add_comment', {});
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

      <ListGroupItem class=py-2>
        <PersonName person={$person}/>
      </ListGroupItem>

      {#if $person.gender || $person.date_of_birth}
        <ListGroupItem class=py-2>
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
        </ListGroupItem>
      {/if}

      {#if $person.phone_mobile}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="gsm">{$person.phone_mobile}</div>
          <idv>
            <Badge color=primary>
              GSM
            </Badge>
          </idv>
        </ListGroupItem>
      {/if}

      {#if $person.phone_home}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="telefoon thuis">{$person.phone_home}</div>
          <idv>
            <Badge color=primary>
              Tel.thuis
            </Badge>
          </idv>
        </ListGroupItem>
      {/if}

      {#if $person.email}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="email">{$person.email}</div>
          <idv>
          </idv>
        </ListGroupItem>
      {/if}

      {#if $person.address || $person.address_zipcode || $person.address_municipality}
        <ListGroupItem class=py-2>
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
        </ListGroupItem>
      {/if}

      {#if $person.phone_work}
        <ListGroupItem class="d-flex w-100 justify-content-between py-2">
          <div title="telefoon werk">{$person.phone_work}</div>
          <idv>
            <Button color=primary>Tel.werk</Button>
          </idv>
        </ListGroupItem>
      {/if}

      {#if $person.group}
        <ListGroupItem active title="werkgroep" class=py-2>
          {$person.group}
        </ListGroupItem>
      {/if}

      {#if $person.team}
        <ListGroupItem active title="ploeg" class=py-2>
          {$person.team}
        </ListGroupItem>
      {/if}

    </ListGroup>
    <CardFooter>
      <Button title="lidjaar OK" color=success class=mr-3>
        2020
      </Button>
      <Button title="lidjaar{ member_2021 ? ' OK' : ''}" color={member_2021 ? 'success' : 'dark'}>
        2021
      </Button>
    </CardFooter>
  </Card>

  <Card>
    <CardHeader class=bg-info>
      Gelinkte data
    </CardHeader>
    <PersonNFC />
    <CardBody>
      <PersonRegLog />
    </CardBody>
    <!--
    <ListGroup>
      <ListGroupItem class="bg-danger d-flex w-100 justify-content-between">
        <div>

        </div>
        <div>
          <Button color=danger class="border border-white" title="Verwijder dit commentaar">
            Verw
          </Button>
        </div>
      </ListGroupItem>
      <ListGroupItem class="d-flex w-100 justify-content-end">
        <Button color=dark>
          Toon alle (6)
        </Button>
        <Button color=primary on:click={handleAddComment}>
          Opmerking toevoegen
        </Button>
      </ListGroupItem>
    </ListGroup>
    <CardBody>
      Data
    </CardBody>
    -->
    <div class="card-footer d-flex w-100 justify-content-end">
      <Button color=dark class=ml-3 on:click={() => $person = undefined}>
        Sluiten
      </Button>
      <Button color=primary class=ml-3 on:click={handleRegisterByManual}>
        Registreer
      </Button>
    </div>
  </Card>
</CardGroup>
{/if}
