<script>
  import { Badge } from 'sveltestrap';
  import { focus_year } from '../../services/store';

  export let title = 'lid in ' + $focus_year.toString();
</script>

<Badge color=success {title}>
  {$focus_year.toString()}
</Badge>
