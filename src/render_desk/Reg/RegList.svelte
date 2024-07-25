<script>
  import { Row, Col } from 'sveltestrap';
  import RegItem from './RegItem.svelte';
  import { reg_map } from '../../services/store';
  import RegAlertDesk from './RegAlertDesk.svelte';
  import ListGroup from '../../render/Common/ListGroup.svelte';
  import ListGroupItem from '../../render/Common/ListGroupItem.svelte';
  import Checkbox from '../../render/Common/Checkbox.svelte';

  let show_valid = true;
  let show_unvalid = true;

  $: valid_index_map = new Map([...$reg_map.values()].filter((r) => typeof r.invalid === 'undefined').map((r, i) => [r._id, i + 1]));
</script>

<Row>
  <Col class=h-100>
    <ListGroup>
      <li class="list-group-item bg-darkgrey">
        <Row class=mb-2>
          <Col sm=6>
            <h3>
              Registraties <span class=sub>laatste 5 uur</span>
            </h3>
          </Col>
          <Col>
            <Checkbox name=show_valid
              title="Toon geldige registraties"
              bind:checked={show_valid}
            >
              Geldig: {valid_index_map.size}
            </Checkbox>
          </Col>
          <Col>
            <Checkbox name=show_unvalid
              title="Toon ongeldige registraties"
              bind:checked={show_unvalid}
            >
              Ongeldig: {$reg_map.size - valid_index_map.size}
            </Checkbox>
          </Col>
        </Row>
      </li>

      <RegAlertDesk />

      {#each [...$reg_map].reverse() as [reg_id, reg](reg._id)}
        {#if (show_valid && show_unvalid)
          || (valid_index_map.has(reg_id) && show_valid)
          || (!valid_index_map.has(reg_id) && show_unvalid)
        }
        <RegItem {reg} count={valid_index_map.get(reg_id)} />
        {/if}
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
  span.sub {
    font-size: .7em;
  }
</style>
