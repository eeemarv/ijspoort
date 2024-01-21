<script>
  import { Badge } from 'sveltestrap';

  export let ts;
  export let title = 'tijdstip';
  export let color = 'primary';

  $: ts_date = new Date(ts);
</script>

<Badge {color} {title}>
  {ts_date.getHours().toString().padStart(2, '0')}:
  {ts_date.getMinutes().toString().padStart(2, '0')}
</Badge>
