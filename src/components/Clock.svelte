<script>
    import { onMount } from 'svelte';

	let time = new Date();
	$: hours = time.getHours().toString().padStart(2, '0');
	$: minutes = time.getMinutes().toString().padStart(2, '0');
    $: seconds = time.getSeconds();

	onMount(() => {
		const timer_interval = setInterval(() => {
			time = new Date();
        }, 1000);
		return () => {
			clearInterval(timer_interval);
		};
    });
</script>

<div title="klok">
    {hours}&nbsp;{seconds % 2 ? ':' : ' '}&nbsp;{minutes}
</div>