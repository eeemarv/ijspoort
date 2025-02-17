<script>
  import ListGroup from "../Common/ListGroup.svelte";
  import ListGroupItem from "../Common/ListGroupItem.svelte";

  export let error;
</script>

<ListGroup>
  <ListGroupItem color=danger>
    <p>{error}</p>
  </ListGroupItem>
</ListGroup>