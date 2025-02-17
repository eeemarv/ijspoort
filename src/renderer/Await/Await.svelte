<script>
  import { Spinner } from 'sveltestrap';
  import ListGroup from '../Common/ListGroup.svelte';
  import ListGroupItem from '../Common/ListGroupItem.svelte';

  export let text = '...data ophalen';

</script>

<ListGroup>
  <ListGroupItem color=warning>
    <Spinner color=dark />
    {text}
  </ListGroupItem>
</ListGroup>