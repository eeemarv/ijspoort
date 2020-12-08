<script>
    import { Card, CardBody, CardFooter, CardHeader, CardText } from 'sveltestrap';
    import { Button } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');

    let status = 'off';
    let name = '';
</script>

<Card class=m-3>
    <div class="card-header py-2"
        class:bg-success={status === 'ok'}
        class:bg-danger={status === 'nobody'}
    >
        Poortwachter
    </div>
    <div class="card-body py-2">
        <CardText class="py-0 mb-0">
            {name ? name : '---'}
        </CardText>
    </div>
    <CardFooter class="d-flex w-100 justify-content-end">
        <Button color=primary title="Selecteer poortwachter">
            Selecteer
        </Button>
    </CardFooter>
</Card>