<script>
  import { Badge } from "sveltestrap";

  export let count = undefined;
</script>


<Badge color=info title="teller">
  {count}
</Badge>