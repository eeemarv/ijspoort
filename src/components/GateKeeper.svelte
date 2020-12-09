<script>
    import { Badge, Card, CardBody, CardFooter, CardHeader, CardText } from 'sveltestrap';
    import { Button } from 'sveltestrap';
    import { person, gate_keeper } from './../services/store';

    $: console.log('gate_keeper: ', $gate_keeper);

    const handleCheckIn = () => {
        $gate_keeper = $person;
    };
    const handleCheckOut = () => {
        $gate_keeper = undefined;
    };

</script>

<Card class=m-3>
    <div class="card-header py-2"
        class:bg-danger={!$gate_keeper}
    >
        Poortwachter
    </div>
    <div class="card-body py-2">
        <CardText class="py-0 mb-0">
            {#if $gate_keeper}
                <Badge color=light title="lidnummer">
                    {$gate_keeper.member_id}
                </Badge>&nbsp;
                <span title="voornaam">
                    {$gate_keeper.firstname}
                </span>
            {:else}
                ---
            {/if}
        </CardText>
    </div>
    <CardFooter class="d-flex w-100 justify-content-end">
        <Button
            color=info
            title="poortwachter check-in"
            class=mr-3
            disabled={!$person}
            on:click={handleCheckIn}
        >
            &gt; In
        </Button>
        <Button
            color=info
            title="poortwachter check-out"
            disabled={!$gate_keeper}
            on:click={handleCheckOut}
        >
            Uit &gt;
        </Button>
    </CardFooter>
</Card>