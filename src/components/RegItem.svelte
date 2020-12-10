<script>
  import { ListGroupItem, Button, Badge } from 'sveltestrap';
  import { createEventDispatcher } from 'svelte';
  import { person } from './../services/store';
  export let regIndex;
  export let reg;
  export let nfcCount = 0;
  export let eidCount = 0;

  const dispatch = createEventDispatcher();

  const handleRemoveReg = dispatch('remove_reg', {

  });
  const handleSelectReg = () => {
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
        <Badge color=warning title="tijdstip">
          {reg.hours}:{reg.minutes}
        </Badge>
        &nbsp;
        <Badge color=light title="lidnummer">
          {reg.member_id}
        </Badge>
        &nbsp;
        <span title="voornaam">
           {reg.firstname}
        </span>
        &nbsp;
        {#if reg.nickname}
          <span title="roepnaam">
            ({reg.nickname})
          </span>
          &nbsp;
        {/if}
        <span title="achternaam">
          {reg.surname}
        </span>
      </div>
      <div class="d-flex w-100 justify-content-between mb-0">
        <div>
          {reg.phone_mobile ?? reg.phone_home ?? reg.phone_work}
        </div>
        <Badge color=secondary>
          eID {eidCount}
        </Badge>
        <Badge color=warning>
          NFC {nfcCount}
        </Badge>
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
