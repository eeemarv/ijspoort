<script>
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { Row, Col, Badge } from 'sveltestrap';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import PersonTag from './PersonTag.svelte';
  import RegTimeTag from '../Reg/RegTimeTag.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import Pagination from '../Common/Pagination.svelte';
  import { get_reg_count_by_person_id } from '../services/reg';
  import { get_reg_list_by_person_id } from '../services/reg';
  import { reg_map } from '../services/store';
  import { person_nfc_map } from '../services/store';
  import NfcTag from '../Nfc/NfcTag.svelte';
  import CountBadge from '../Common/CountBadge.svelte';
  import Await from '../Common/Await.svelte';
  import AwaitError from '../Common/AwaitError.svelte';

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
  const col_count = 2;

  const get_reg_count = async (person_id) => {
    row_count = await get_reg_count_by_person_id(person_id);
    set_total_rows(row_count);
    return row_count;
  };

  const get_reg_cols = async (person_id, rows_per_page, start_row) => {
    const regs = await get_reg_list_by_person_id(person_id, rows_per_page, start_row);

    const col_size = Math.ceil(regs.length / col_count);
    let reg_cols = [];

    while (regs.length){
      reg_cols = [...reg_cols, regs.splice(0, col_size)];
    }

    console.log('reg_cols', reg_cols);

    const abc_map = new Map();

    if ($person_nfc_map.has(person_id)){
      const s = $person_nfc_map.get(person_id);
      [...s].forEach((nfc_id, abc_index) => {
        abc_map.set(nfc_id, abc_index);
      });
    }

    return {
      reg_cols: reg_cols,
      abc_map: abc_map,
      start_row: start_row,
      col_size: col_size
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
        {#await get_reg_count(person_id, $reg_map)}
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
      {#await get_reg_cols(person_id, rows_per_page, start_row, $reg_map)}
        <Await />
      {:then res}
        {#each res.reg_cols as col, col_index (col_index)}
          <Col>
            <ListGroup>
              {#each col as reg, reg_index(reg._id)}
                <ListGroupItem>
                  <CountBadge count={row_count - res.start_row - reg_index - (res.col_size * col_index)} />
                  <RegTimeTag {reg} />
                  {#if reg.nfc_uid}
                    <NfcTag nfc_id={'uid_' + reg.nfc_uid}
                      show_abc_index
                      abc_index={res.abc_map.get('uid_' + reg.nfc_uid)}
                    />
                  {/if}
                  <LocaleDateString ts_epoch={reg.ts_epoch} title="datum" />
                </ListGroupItem>
              {/each}
            </ListGroup>
          </Col>
        {/each}
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
