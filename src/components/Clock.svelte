<script>
    import { onMount } from 'svelte';
    import { Badge, Card, CardBody } from 'sveltestrap';
    import { sync_monitor } from './../services/store';

    const map_sync_color = {
        paused: 'warning',
        error: 'danger',
        active: 'success',
        complete: 'success',
        denied: 'danger'
    };

    let sync_color = 'warning';
    $: sync_color = map_sync_color[$sync_monitor];

	let time = new Date();
	$: hours = time.getHours().toString().padStart(2, '0');
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
            <Badge color={sync_color}>
                Sync
            </Badge>
        </div>
        <div title="klok">
        {hours}&nbsp;{seconds % 2 ? ':' : ' '}&nbsp;{minutes}
        </div>
    </CardBody>
</Card>