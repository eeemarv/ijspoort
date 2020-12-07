<script>
  import { ListGroupItem, Button, Badge } from 'sveltestrap';
  export let regIndex;
  export let reg;
  export let nfcCount = 0;
  export let eidCount = 0;

</script>

<ListGroupItem>
  <div class="d-flex w-100 justify-content-between">
    <dvi>
      <div>
        <span>
          {regIndex} .)
        </span>
        <span class="text-warning">
          {reg.hours}:{reg.minutes}
        </span>
        <span>
          {reg.firstnames} {reg.nickname ? '(' + reg.nickname + ') ' : '' }{ reg.surname }
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
          nfc {nfcCount}
        </Badge>
      </div>
    </dvi>
    <div>
      <Button color=primary class=mr-1>
        Aanpassen
      </Button>
      <Button color=danger>
        Verwijderen
      </Button>
    </div>
  </div>
</ListGroupItem>
