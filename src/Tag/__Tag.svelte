<script>
  import { Badge } from 'sveltestrap';
  import LocaleDateString from '../Common/LocaleDateString.svelte';

  export let tag;
</script>

<Badge color={tag.color} title={tag.description}>
  {tag.text}
</Badge>
&nbsp;
<LocaleDateString ts={tag.ts_epoch} title="datum van aanmaak" />