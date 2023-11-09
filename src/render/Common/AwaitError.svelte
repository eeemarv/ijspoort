<script>
    import { ListGroup, ListGroupItem } from "sveltestrap";
    export let error;
</script>
<ListGroup>
  <ListGroupItem class=bg-danger>
    <p>{error}</p>
  </ListGroupItem>
</ListGroup>