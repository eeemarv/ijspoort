<script>
  import { Row, Col, ListGroup, ListGroupItem } from 'sveltestrap';
  import RegItem from './RegItem.svelte';
  import { reg_map } from '../services/store';
  import RegBlockedItem from './RegBlockedItem.svelte';

  const show_blocked_time = 1500;
  let blocked_reg_person_id = undefined;

  export const show_blocked_reg = (person_id) => {
    blocked_reg_person_id = person_id;
    setTimeout(() => {
      blocked_reg_person_id = undefined;
    }, show_blocked_time);
  };

  $: console.log('++ REG MAP  ++', $reg_map);
</script>

<Row>
  <Col class=h-100>
    <ListGroup>
      <ListGroupItem>
          <p><br></p>
      </ListGroupItem>

      {#if blocked_reg_person_id}
        <RegBlockedItem person_id={blocked_reg_person_id} />
      {/if}

      {#each [...$reg_map].reverse() as [reg_id, reg], index(reg._id)}
        <RegItem {reg} count={$reg_map.size - index} />
      {/each}

      {#if $reg_map.size === 0}
        <ListGroupItem class=bg-primary>
          <p>Nog geen registraties</p>
        </ListGroupItem>
      {/if}
    </ListGroup>
  </Col>
</Row>
