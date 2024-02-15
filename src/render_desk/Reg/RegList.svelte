<script>
  import { Row, Col } from 'sveltestrap';
  import RegItem from './RegItem.svelte';
  import { reg_map } from '../../services/store';
  import RegAlertDesk from './RegAlertDesk.svelte';
  import ListGroup from '../../render/Common/ListGroup.svelte';
  import ListGroupItem from '../../render/Common/ListGroupItem.svelte';

</script>

<Row>
  <Col class=h-100>
    <ListGroup>
      <ListGroupItem>
          <p><br></p>
      </ListGroupItem>

      <RegAlertDesk />

      {#each [...$reg_map].reverse() as [reg_id, reg], index(reg._id)}
        <RegItem {reg} count={$reg_map.size - index} />
      {/each}

      {#if $reg_map.size === 0}
        <ListGroupItem color=primary>
          <p>Nog geen registraties</p>
        </ListGroupItem>
      {/if}
    </ListGroup>
  </Col>
</Row>
