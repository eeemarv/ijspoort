<script>
  import { Row, Col } from 'sveltestrap';
  import RegItem from './RegItem.svelte';
  import { reg_map } from '../../services/store';
  import RegAlertDesk from './RegAlertDesk.svelte';
  import ListGroup from '../../render/Common/ListGroup.svelte';
  import ListGroupItem from '../../render/Common/ListGroupItem.svelte';

  $: valid_index_map = new Map([...$reg_map.values()].filter((r) => typeof r.invalid === 'undefined').map((r, i) => [r._id, i + 1]));
</script>

<Row>
  <Col class=h-100>
    <ListGroup>
      <li class="list-group-item bg-primary">
          <h3>Registraties</h3>
      </li>

      <RegAlertDesk />

      {#each [...$reg_map].reverse() as [reg_id, reg](reg._id)}
        <RegItem {reg} count={valid_index_map.get(reg_id)} />
      {/each}

      {#if $reg_map.size === 0}
        <ListGroupItem color=primary>
          <p>Nog geen registraties</p>
        </ListGroupItem>
      {/if}
    </ListGroup>
  </Col>
</Row>

<style>
  li {
    border-bottom:  1px solid lightgrey;
  }
</style>
