<script>
  const { ipcRenderer } = window.require('electron');
  import { Card, CardHeader, CardBody, CardFooter, CardGroup } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Badge } from 'sveltestrap';
  import { xls_assist_import } from './../services/person';

  ipcRenderer.on('xls.assist.import', (ev, file) => {
    xls_assist_import(file);
  });

</script>

<CardGroup>
  <Card>
    <CardHeader class=bg-info>
      Lid (Assist)
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

  <Card>
    <CardHeader class=bg-info>
      Gelinkte data
    </CardHeader>
    <ListGroup>
      <ListGroupItem class="bg-danger d-flex w-100 justify-content-between">
        <div>
        Hola dit kan echt niet
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
        <Button color=primary>
          Opmerking toevoegen
        </Button>
      </ListGroupItem>
    </ListGroup>
    <CardBody>
      Data
    </CardBody>
    <div class="card-footer d-flex w-100 justify-content-end">
      <Button color=dark class=ml-3>
        Sluiten
      </Button>
      <Button color=primary class=ml-3>
        Registreer
      </Button>
    </div>
  </Card>
</CardGroup>