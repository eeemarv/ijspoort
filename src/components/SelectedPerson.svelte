<script>
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
</script>

<CardGroup>
  <Card>
    <CardHeader class=bg-info>
      Lid (Assist database)
    </CardHeader>
    <ListGroup>
      <ListGroupItem class="d-flex w-100 justify-content-between">
        <div title="lidnummer">2050</div>
        <div title="inschrijvingsdatum">05.05.1962</div>
      </ListGroupItem>
      <ListGroupItem>
        <span title="voornaam">Maarten</span>
        <span title="achternaam">Vandekeybus</span>
      </ListGroupItem>
      <ListGroupItem>
        <Badge color=info title=man>M</Badge>
        <Badge color=danger title=vrouw>V</Badge>
        <span title="geboortedatum">15 mei 1974</span>
      </ListGroupItem>
      <ListGroupItem class="d-flex w-100 justify-content-between">
        <div title="gsm">0467 09 28 94</div>
        <idv>
          <Button color=primary>GSM</Button>
        </idv>
      </ListGroupItem>
      <ListGroupItem class="d-flex w-100 justify-content-between">
        <div title="telefoon thuis">0467 09 28 94</div>
        <idv>
          <Button color=primary>Tel. thuis</Button>
        </idv>
      </ListGroupItem>

      <ListGroupItem active title="werkgroep">
        Redders
      </ListGroupItem>
      <ListGroupItem active title="ploeg">
        a@martti.be
      </ListGroupItem>


    </ListGroup>
    <CardFooter>
      <Button color=success>2020</Button>
      <Button color=dark>2021</Button>
    </CardFooter>
  </Card>

  <Card>
    <CardHeader class=bg-info>
      Gelinkte data
    </CardHeader>
    <CardBody>
      Data
    </CardBody>
    <CardFooter class="d-flex w-100 justify-content-end">
      <div>
        <Button color=dark>
          Sluiten
        </Button>
      <Button color=primary>
        Registreer
      </Button>
      </div>
    </CardFooter>
  </Card>
</CardGroup>