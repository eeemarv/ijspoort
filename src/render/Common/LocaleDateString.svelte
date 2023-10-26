<script>
  export let ts_epoch = undefined;
  export let title = 'datum';

  $: ts_date = new Date(ts_epoch);
</script>

<span {title}>
  {ts_date.toLocaleDateString('nl-BE', {weekday: 'short', month: 'short', year: 'numeric', day:'numeric'})}
</span>