<script>
  import { Badge } from 'sveltestrap';
  import { get_time_str } from '../../services/functions';

  export let ts;
  export let title = 'tijdstip';
  export let color = 'primary';
</script>

<Badge {color} {title}>
  {get_time_str(ts)}
</Badge>
