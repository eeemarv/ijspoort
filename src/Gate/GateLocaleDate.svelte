<script>
  import { onMount } from 'svelte';

  let ts_date = new Date();

  onMount(() => {
    const timer_interval = setInterval(() => {
      ts_date = new Date();
    }, 1000);
    return () => {
      clearInterval(timer_interval);
    };
  });
</script>

<span>
<span>
  {ts_date.toLocaleDateString('nl-BE', {weekday: 'short'})}
</span>
<br />
<span>
  {ts_date.toLocaleDateString('nl-BE', {day: 'numeric', month: 'short', })}
</span>
</span>

<style>
span {
 font-size: 1.8em;
 line-height: 1;
}
</style>