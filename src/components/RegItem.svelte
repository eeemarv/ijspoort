<script>
  import { db_person, db_reg } from './../services/pouchdb';
  import { Button, Badge } from 'sveltestrap';
  import { onMount } from 'svelte';
  import { person } from './../services/store';

  export let regIndex;
  export let reg;

  let deleted = false;
  let selected = false;

  function handleSelectReg(){
    selected = true;
    setTimeout(() => {selected = false}, 300);
    db_person.get(reg.person_id).then((res) => {
        $person = res;
    }).catch((err) => {
        console.log(err);
    });
  }
  function handleRemoveReg(event){
    deleted = true;
    setTimeout(() => {
        console.log(event);
        db_reg.remove(reg).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }, 500);
  }

  onMount(() => {
    setTimeout(() => {reg.newly_add = undefined}, 1000);
  });
</script>

<li class="list-group-item{reg.newly_add ? ' bg-success' : ''}{deleted ? ' bg-danger' : ''}{selected ? ' bg-primary' : ''}">
<div class="d-flex w-100 justify-content-between">
    <dvi>
      <div>
        <Badge color=info title="teller">
          {regIndex}
        </Badge>
        &nbsp;
        <Badge color=primary title="tijdstip">
          {reg.ts_lc_hours}:{reg.ts_lc_minutes}
        </Badge>
        &nbsp;
        <Badge color=light title="lidnummer">
          {reg.person.member_id}
        </Badge>
        &nbsp;
        <span title="voornaam">
           {reg.person.firstname}
        </span>
        &nbsp;
        {#if reg.person.nickname}
          <span title="roepnaam">
            ({reg.person.nickname})
          </span>
          &nbsp;
        {/if}
        <span title="achternaam">
          {reg.person.surname}
        </span>
      </div>
      <div class="d-flex w-100 justify-content-between mb-0">
        <div>
          {#if reg.person.phone_mobile }
            <span title="gsm">
              {reg.person.phone_mobile}
            </span>
          {:else if reg.person.phone_home}
            <span title="telefoon thuis">
              {reg.person.phone_home}
            </span>
          {:else if reg.person.phone_work}
            <span title="telefoon werk">
              {reg.person.phone_work}
            </span>
          {:else}
            <span>&nbsp;</span>
          {/if}
        </div>
      </div>
    </dvi>
    <div>
      <Button color=primary class=mr-1 on:click={handleSelectReg}>
        Selecteer
      </Button>
      <Button color=danger on:click={handleRemoveReg}>
        Verwijderen
      </Button>
    </div>
  </div>
</li>
