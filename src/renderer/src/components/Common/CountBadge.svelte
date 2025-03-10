<script>
  import { Badge } from  '@sveltestrap/sveltestrap';

  export let count = undefined;
  export let valid = true;
</script>


<Badge color={ valid ? 'info' : 'danger'} title="teller">
  {count ?? '-'}
</Badge>