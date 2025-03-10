<script>
  import {Badge} from '@sveltestrap/sveltestrap';
  import { Spinner } from '@sveltestrap/sveltestrap';
  export let text = '';
</script>

<Badge color=warning
  title="data ophalen">
  <Spinner color=dark />
  {text}
</Badge>
