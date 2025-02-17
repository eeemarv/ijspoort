<script>
  import {Badge} from 'sveltestrap';
  import { Spinner } from 'sveltestrap';
  export let text = '';
</script>

<Badge color=warning
  title="data ophalen">
  <Spinner color=dark />
  {text}
</Badge>
