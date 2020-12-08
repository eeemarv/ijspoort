<script>
    import { Badge, Card, CardBody, CardFooter, CardGroup, CardHeader, CardText, ListGroup, ListGroupItem } from 'sveltestrap';
    import { Button } from 'sveltestrap';
    const { ipcRenderer } = window.require('electron');

</script>

<CardGroup>
    <Card body >
        <div class="d-flex w-100 justify-content-between">
        <div>2020</div>
        <div>
            <Badge color=info title="aantal leden in 2020">
                964
            </Badge>
        </div>
        </div>
    </Card>
    <Card body>
        <div class="d-flex w-100 justify-content-between">
            <div>2021</div>
            <div>
                <Badge color=info title="aantal leden in 2021">
                    964
                </Badge>
            </div>
        </div>
    </Card>
</CardGroup>
