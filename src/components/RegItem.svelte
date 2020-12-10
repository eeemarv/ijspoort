<script>
  import { ListGroupItem, Button, Badge } from 'sveltestrap';
  import { createEventDispatcher } from 'svelte';
  import { person } from './../services/store';
  export let regIndex;
  export let reg;

  const dispatch = createEventDispatcher();

  const handleRemoveReg = dispatch('remove_reg', {

  });
  const handleSelectReg = (event) => {
    console.log(event);
    $person = undefined;
  };

</script>

<ListGroupItem>
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
</ListGroupItem>
