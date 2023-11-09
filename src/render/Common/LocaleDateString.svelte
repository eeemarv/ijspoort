<script>
  export let ts_epoch = undefined;
  export let title = 'datum';
</script>

<span {title}>
  {(new Date(ts_epoch)).toLocaleDateString('nl-BE', {weekday: 'short', month: 'short', year: 'numeric', day:'numeric'})}
</span>