<script>
    import { onMount } from 'svelte';
    import { Badge, Card, CardBody, CardText } from 'sveltestrap';

	let time = new Date();
	$: hours = time.getHours().toString();
	$: minutes = time.getMinutes().toString().padStart(2, '0');
    $: seconds = time.getSeconds();

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<Card>
    <CardBody class="d-flex w-100 justify-content-between">
        <div title="synchronisatie met remote database">
            <Badge color=warning>
                Sync
            </Badge>
        </div>
        <div title="klok">
        {hours}&nbsp;{seconds % 2 ? ':' : ' '}&nbsp;{minutes}
        </div>
    </CardBody>
</Card>