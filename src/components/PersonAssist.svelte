<script>
  const { ipcRenderer } = window.require('electron');
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';

</script>

<Card>
    <CardHeader class=bg-info>
      Lid : Assist
    </CardHeader>
    <ListGroup>
      <ListGroupItem class="d-flex w-100 justify-content-between">
        <div title="lidnummer">2050</div>
        <div title="inschrijvingsdatum">05.05.1962</div>
      </ListGroupItem>
      <ListGroupItem>
        <span title="voornaam">   </span>
        <span title="achternaam">  </span>
      </ListGroupItem>
      <ListGroupItem>
        <Badge color=info title=man>M</Badge>
        <Badge color=danger title=vrouw>V</Badge>
        <span title="geboortedatum">25 jan 1986</span>
      </ListGroupItem>
      <ListGroupItem class="d-flex w-100 justify-content-between">
        <div title="gsm">04674</div>
        <idv>
          <Button color=primary>GSM</Button>
        </idv>
      </ListGroupItem>
      <ListGroupItem class="d-flex w-100 justify-content-between">
        <div title="telefoon thuis">0467 09 94</div>
        <idv>
          <Button color=primary>Tel. thuis</Button>
        </idv>
      </ListGroupItem>

      <ListGroupItem active title="werkgroep">
        Redders
      </ListGroupItem>
      <ListGroupItem active title="ploeg">

      </ListGroupItem>


    </ListGroup>
    <CardFooter>
      <Button color=success class=mr-3>2020</Button>
      <Button color=dark>2021</Button>
  </CardFooter>
</Card>
