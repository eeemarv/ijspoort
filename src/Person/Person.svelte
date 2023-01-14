<script>
  const { ipcRenderer } = window.require('electron');
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { createEventDispatcher } from 'svelte';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { xls_assist_import } from './../services/person';
  import { person, person_nfc_list } from './../services/store';
  import { assist_import_year } from './../services/store';
  import { tag_display_enabled } from './../services/store';
  import PersonNfc from './PersonNfc.svelte';
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import PersonRegLog from './PersonRegLog.svelte';
  import PersonMemberYear from './PersonMemberYear.svelte';
  import PersonSearchSimular from './PersonSearchSimular.svelte';
  import PersonTagList from './PersonTagList.svelte';

  let group_ary = [];

  $: {
    $assist_import_year;
    ipcRenderer.send('rebuild_menu');
  }

  ipcRenderer.on('xls.assist.import', (ev, file) => {
    if (!$assist_import_year){
      return;
    }
    if ($assist_import_year < 2010){
      return;
    }
    if ($assist_import_year > 2030){
      return;
    }
    xls_assist_import(file, $assist_import_year.toString());
  });

  const dispatch = createEventDispatcher();

  $: {
    if (typeof $person === 'undefined'){
      $person_nfc_list = [];
      group_ary = [];
    } else {
      console.log($person);
      if ($person.group){
        group_ary = $person.group.split(',');
      } else {
        group_ary = [];
      }
    }
  }

  const handle_click_manual_reg = (() => {
    dispatch('click_manual_reg');
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
            <span class="badge bg-info" title="man">
              M
            </span>
            &nbsp;
          {/if}
          {#if $person.gender === 'f'}
            <span class="badge bg-danger" title="vrouw">
              V
            </span>
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

      {#each group_ary as grp}
        <ListGroupItem title="werkgroep" class="d-flex w-100 justify-content-between py-2 bg-info">
          <div title="werkgroep">{grp}</div>
          <PersonSearchSimular type=group group={grp}/>
        </ListGroupItem>
      {/each}

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
    <ListGroup>
    <PersonNfc />
    <PersonRegLog />
    {#if $tag_display_enabled}
      <PersonTagList />
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
        on:click={() => $person = undefined}
      >
        Sluiten
      </Button>
    </div>
  </Card>
</CardGroup>
{/if}
