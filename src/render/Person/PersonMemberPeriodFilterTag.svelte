<script>
  import { Badge } from 'sveltestrap';
  import { member_period_filter } from '../../services/store';

  export let title = 'lid in ' + $member_period_filter;
</script>

{#if $member_period_filter && $member_period_filter !== '^'}
  <Badge color=success {title}>
    {$member_period_filter}
  </Badge>
{/if}