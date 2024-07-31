<script>
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
  import ListGroup from '../../render/Common/ListGroup.svelte';
  import Checkbox from '../../render/Common/Checkbox.svelte';
  import RegInvalid from '../Reg/RegInvalid.svelte';

  export let person_id = undefined;

  export const open_reg_list = () => {
    open = true;
  };

  let open = false;
  const toggle = () => (open = !open);

  let show_valid = true;
  let show_invalid = true;

  let start_row = 0;
  let rows_per_page = 10;
  let set_total_rows = () => {};

  let row_count = 0;
  let valid_count = 0;
  let invalid_count = 0;

  const reg_get_list = async (person_id, rows_per_page, start_row, show_valid, show_invalid) => {
    const regs = await reg_get_list_by_person_id(person_id, rows_per_page, start_row, show_valid, show_invalid);

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

  const calc_counts = async () => {
    valid_count = await reg_get_count_by_person_id(person_id, true, false);
    invalid_count = await reg_get_count_by_person_id(person_id, false, true);
    row_count = (show_valid ? valid_count : 0) + (show_invalid ? invalid_count : 0);
    set_total_rows(row_count);
  };

  $: if (!person_id){
    open = false;
  }

  $: {
    open;
    person_id;
    $reg_map;
    show_valid;
    show_invalid;
    calc_counts();
  }

  $: if (open){
    show_valid = true;
    show_invalid = true;
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
        <div>
          Totaal: {valid_count + invalid_count}
        </div>
        <Checkbox name=show_valid_check
          title="Toon geldige registraties"
          bind:checked={show_valid}
        >
          Geldig: {valid_count}
        </Checkbox>
        <Checkbox name=show_invalid_check
          title="Toon ongeldige registraties"
          bind:checked={show_invalid}
        >
          Ongeldig: {invalid_count}
        </Checkbox>
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
      {#await reg_get_list(person_id, rows_per_page, start_row, show_valid, show_invalid, $reg_map)}
        <Await />
      {:then res}
          <Col>
            <ListGroup>
              {#each res.regs as reg, reg_index(reg._id)}
                <li class="list-group-item"
                  class:invalid={typeof reg.invalid !== 'undefined'}
                >
                  <CountBadge
                    count={row_count - res.start_row - reg_index}
                    valid={typeof reg.invalid === 'undefined'}
                  />
                  <RegTimeTag {reg} />
                  {#if reg.nfc_uid}
                    <NfcTag nfc_id={nfc_uid_to_id(reg.nfc_uid)}
                      show_uid_type
                      abc_index={res.abc_map.get(nfc_uid_to_id(reg.nfc_uid))}
                    />
                  {/if}
                  <LocaleDateString ts_epoch={reg.ts_epoch} title="datum" />
                  {#if reg.blocked_nfcs}
                    <div class="badge bg-deepbrown blocked-badge">
                      Geblokkeerd:
                        {#each reg.blocked_nfcs as nfc_uid, index(index)}
                          <NfcTag nfc_id={nfc_uid_to_id(nfc_uid)}
                            abc_index={res.abc_map.get(nfc_uid_to_id(nfc_uid))}
                          />
                        {/each}
                    </div>
                  {/if}
                  <RegInvalid {reg} />
                </li>
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
      <span>Legende (kleur tijd)</span>
      <Badge color=primary class=me-2>
        NFC-desk
      </Badge>
      <Badge color=accent class=me-2>
        NFC-poort
      </Badge>
      <Badge color=warning class=me-2>
        Manueel
      </Badge>
    </div>
  </ModalFooterClose>
</Modal>

<style>
li:nth-child(even) {
  background-color: black;
}
li {
  border-bottom:  1px solid lightgrey;
}
li.invalid {
  background-color: rgb(70, 10, 10);
}
div.blocked-badge {
  border: 1px solid grey;
}
</style>
