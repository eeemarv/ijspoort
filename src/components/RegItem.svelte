<script>
  import { db_person, db_reg } from '../services/db';
  import { Button, Badge } from 'sveltestrap';
  import { onMount } from 'svelte';
  import { person } from './../services/store';

  export let regIndex;
  export let reg;

  $: ts_date = new Date(reg.ts_epoch);

  let deleted = false;
  let selected = false;
  let person_data = {};

  const handle_select_reg = () => {
    selected = true;
    setTimeout(() => {selected = false}, 300);
    db_person.get(reg.person_id).then((res) => {
        $person = res;
    }).catch((err) => {
        console.log(err);
    });
  }
  const handle_remove_reg = (event) => {
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
    db_person.get(reg.person_id).then((res) => {
      console.log('mount reg, get person data');
      person_data = res;
    });
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
          {ts_date.getHours().toString().padStart(2, '0')}:
          {ts_date.getMinutes().toString().padStart(2, '0')}
        </Badge>
        &nbsp;
        <Badge color=light title="lidnummer">
          {person_data.member_id}
        </Badge>
        &nbsp;
        <span title="voornaam">
           {person_data.firstname}
        </span>
        &nbsp;
        {#if person_data.nickname}
          <span title="roepnaam">
            ({person_data.nickname})
          </span>
          &nbsp;
        {/if}
        <span title="achternaam">
          {person_data.surname}
        </span>
      </div>
      <div class="d-flex w-100 justify-content-between mb-0">
        <div>
          {#if person_data.phone_mobile }
            <span title="gsm">
              {person_data.phone_mobile}
            </span>
          {:else if person_data.phone_home}
            <span title="telefoon thuis">
              {person_data.phone_home}
            </span>
          {:else if person_data.phone_work}
            <span title="telefoon werk">
              {person_data.phone_work}
            </span>
          {:else}
            <span>&nbsp;</span>
          {/if}
        </div>
      </div>
    </dvi>
    <div>
      <Button color=primary class=mr-1 on:click={handle_select_reg}>
        Selecteer
      </Button>
      <Button color=danger on:click={handle_remove_reg}>
        Verwijder
      </Button>
    </div>
  </div>
</li>
