<script>
  export let ts;
  export let title;

  let ts_date = new Date(ts);
</script>

<span {title}>
  {ts_date.toLocaleDateString('nl-BE', {weekday: 'short', month: 'short', year: 'numeric', day:'numeric'})}
</span>