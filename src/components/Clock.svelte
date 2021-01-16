<script>
    import { onMount } from 'svelte';
    import { Badge, Card, CardBody } from 'sveltestrap';
    import { sync_monitor } from './../services/store';
    import { db_remote_reg } from './../services/db';

    const map_sync_color = {
        paused: 'warning',
        error: 'danger',
        active: 'success',
        complete: 'success',
        denied: 'danger'
    };

    let probe_db_color = 'warning';
    let sync_color = 'warning';
    $: sync_color = map_sync_color[$sync_monitor];

	let time = new Date();
	$: hours = time.getHours().toString().padStart(2, '0');
	$: minutes = time.getMinutes().toString().padStart(2, '0');
    $: seconds = time.getSeconds();

	onMount(() => {
		const timer_interval = setInterval(() => {
			time = new Date();
        }, 1000);
        const probe_db_interval = setInterval(() => {
            db_remote_reg.info().then((res) => {
                probe_db_color = 'success';
            }).catch((err) => {
                probe_db_color = 'danger';
                console.log(err);
            });
        }, 3000);
		return () => {
			clearInterval(timer_interval);
			clearInterval(probe_db_interval);
		};
    });
</script>

<Card>
    <CardBody class="d-flex w-100 justify-content-between">
        <div>
            <Badge color={sync_color} title="synchronisatie met remote database">
                Sync
            </Badge>
            <Badge color={probe_db_color} title="remote database verbinding">
                DB
            </Badge>
        </div>
        <div title="klok">
        {hours}&nbsp;{seconds % 2 ? ':' : ' '}&nbsp;{minutes}
        </div>
    </CardBody>
</Card>