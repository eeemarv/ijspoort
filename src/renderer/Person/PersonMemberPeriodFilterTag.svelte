<script>
  import { Badge } from 'sveltestrap';
  import { desk_member_period_filter } from '../services/store';

  export let title = 'lid in ' + $desk_member_period_filter;
</script>

{#if $desk_member_period_filter && $desk_member_period_filter !== '^'}
  <Badge color=success {title}>
    {$desk_member_period_filter}
  </Badge>
{/if}