<script>
  import { Button, Modal, ModalBody, ModalHeader, Row, Col } from 'sveltestrap';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import { get_reg_csv_export_buttons, reg_csv_export } from '../../../db_export/reg_csv_export';
  import Await from '../../Await/Await.svelte';
  import AwaitError from '../../Await/AwaitError.svelte';
  import AwaitNoResults from '../../Await/AwaitNoResults.svelte';
  import { get_date_str } from '../../../services/functions';
  import ListGroup from '../../Common/ListGroup.svelte';
  import ListGroupItem from '../../Common/ListGroupItem.svelte';

  const period_in_days = 90;

  let open = false;

  const toggle = () => {
    open = !open
  };

  window.bridge.onMenuRegCsvExport(() => {
    open = true;
  });
</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Export registraties per dag
  </ModalHeader>
  <ModalBody>
    <Row>
      {#await get_reg_csv_export_buttons(period_in_days)}
        <Await />
      {:then cols}
        {#if cols[0]}
          {#each cols as col, index(index)}
            <Col>
              <ListGroup>
                {#each col as btn(btn.ts_day)}
                  <ListGroupItem>
                    <Button
                      color=purple
                      on:click={() => {reg_csv_export(btn.ts_day); toggle();}}>
                      {get_date_str(btn.ts_day)} ({btn.reg_count})
                    </Button>
                  </ListGroupItem>
                {/each}
              </ListGroup>
            </Col>
          {/each}
        {:else}
          <AwaitNoResults />
        {/if}
      {:catch error}
        <AwaitError {error} />
      {/await}
    </Row>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>