<script>
  import { Badge } from 'sveltestrap';
  export let member_id;
</script>

<Badge color=secondary title="lidnummer">
  {member_id}
</Badge>
