<script>
    import { onMount } from 'svelte';

	export let font_size = '1.3em';

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

<div title="klok" class=m-0 style="--font-size: {font_size};">
	{hours}{seconds % 2 ? ':' : ' '}{minutes}
</div>

<style>
div {
 font-weight: bold;
 font-family: Courier;
 font-size: var(--font-size);
 line-height: 1.05;
}
</style>