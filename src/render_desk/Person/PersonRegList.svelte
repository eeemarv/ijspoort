<script>
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { Row, Col, Badge } from 'sveltestrap';
  import LocaleDateString from '../../render/Common/LocaleDateString.svelte';
  import PersonTag from '../../render/Person/PersonTag.svelte';
  import RegTimeTag from '../Reg/RegTimeTag.svelte';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';
  import Pagination from '../../render/Common/Pagination.svelte';
  import { reg_get_count_by_person_id } from '../../db_get/reg_get';
  import { reg_get_list_by_person_id } from '../../db_get/reg_get';
  import { reg_map } from '../../services/store';
  import { person_nfc_map } from '../../services/store';
  import NfcTag from '../../render/Nfc/NfcTag.svelte';
  import CountBadge from '../../render/Common/CountBadge.svelte';
  import Await from '../../render/Await/Await.svelte';
  import AwaitError from '../../render/Await/AwaitError.svelte';
  import { nfc_uid_to_id } from '../../nfc/nfc_id';

  export let person_id = undefined;

  export const open_reg_list = () => {
    open = true;
  };

  let open = false;
  const toggle = () => (open = !open);

  let start_row = 0;
  let rows_per_page = 10;
  let set_total_rows = () => {};

  let row_count = 0;

  const reg_get_count = async (person_id) => {
    row_count = await reg_get_count_by_person_id(person_id);
    set_total_rows(row_count);
    return row_count;
  };

  const reg_get_list = async (person_id, rows_per_page, start_row) => {
    const regs = await reg_get_list_by_person_id(person_id, rows_per_page, start_row);

    console.log('regs', regs);

    const abc_map = new Map();

    if ($person_nfc_map.has(person_id)){
      const s = $person_nfc_map.get(person_id);
      [...s].forEach((nfc_id, abc_index) => {
        abc_map.set(nfc_id, abc_index);
      });
    }

    return {
      regs: regs,
      abc_map: abc_map,
      start_row: start_row
    };
  };

  const handle_pagination_change = (e) => {
    start_row = e.detail.start_row;
    rows_per_page = e.detail.rows_per_page;
  };

  $: if (!person_id){
    open = false;
  }

</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    {#if person_id}
      Registraties&nbsp;
      <PersonTag {person_id} />
    {/if}
  </ModalHeader>
  <ModalBody>
    <Row>
      <Col>
        {#await reg_get_count(person_id, $reg_map)}
          <Await />
        {:then reg_count}
          Totaal: {reg_count}
        {:catch error}
          <AwaitError {error} />
        {/await}
      </Col>
      <Col>
        <Pagination
          bind:rows_per_page
          bind:set_total_rows
          on:change={handle_pagination_change}
        />
      </Col>
    </Row>
    <Row>
      {#await reg_get_list(person_id, rows_per_page, start_row, $reg_map)}
        <Await />
      {:then res}
          <Col>
            <ListGroup>
              {#each res.regs as reg, reg_index(reg._id)}
                <ListGroupItem>
                  <CountBadge count={row_count - res.start_row - reg_index} />
                  <RegTimeTag {reg} />
                  {#if reg.nfc_uid}
                    <NfcTag nfc_id={nfc_uid_to_id(reg.nfc_uid)}
                      show_abc_index
                      abc_index={res.abc_map.get(nfc_uid_to_id(reg.nfc_uid))}
                    />
                  {/if}
                  <LocaleDateString ts_epoch={reg.ts_epoch} title="datum" />
                </ListGroupItem>
              {/each}
            </ListGroup>
          </Col>
      {:catch error}
        <AwaitError {error} />
      {/await}
    </Row>
  </ModalBody>
  <ModalFooterClose on:click={toggle} >
    <div slot=left>
      <span>Legende </span>
      <Badge color=accent>
        NFC
      </Badge>
      &nbsp;
      <Badge color=warning>
        Manueel
      </Badge>
    </div>
  </ModalFooterClose>
</Modal>
