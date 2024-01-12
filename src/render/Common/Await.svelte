<script>
  import { ListGroup, ListGroupItem, Spinner } from 'sveltestrap';

  export let text = '...data ophalen';

</script>

<ListGroup>
  <ListGroupItem class=bg-warning>
    <Spinner color=dark />
    {text}
  </ListGroupItem>
</ListGroup>