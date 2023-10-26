<script>
  import { Button, ListGroup, ListGroupItem } from 'sveltestrap';
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { Row, Col, Badge } from 'sveltestrap';
  import { db_reg } from '../services/db';
  import { person } from '../services/store';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import PersonTag from './PersonTag.svelte';
  import RegTimeTag from '../Reg/RegTimeTag.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';
  import SelectListLength from '../Common/SelectListLength.svelte';

  export let person_id = undefined;

  let open = false;
  const toggle = () => (open = !open);

  let reg_cols = [];
  let reg_count = 0;
  let has_manual_entry = false;
  let person_nfcs = {};
  let person_nfc_ary = [];
  let list_length = 25;

  const nfc_colors = ['blue', 'pink', 'red', 'orange', 'yellow', 'green', 'cyan', 'grey'];

  const update_reg_cols = () => {
    reg_cols = [];
    person_nfcs = {};
    person_nfc_ary = [];

    if (!person_id){
      open = false;
      return;
    }

    db_reg.query('search/count_by_person_id_and_ts_epoch', {
      startkey: person_id + '_',
      endkey: person_id + '_\uffff',
      reduce: true
    }).then((res) => {

      console.log('reg_count');
      console.log(res);

      if (res.rows.length === 0){
        reg_count = 0;
        return;
      }

      reg_count = res.rows[0].value;

      if (!reg_count){
        throw '';
      }


      return db_reg.query('search/count_by_person_id_and_ts_epoch', {
        startkey: person_id + '_\uffff',
        endkey: person_id + '_',
        descending: true,
        include_docs: true,
        limit: list_length,
        reduce: false
      });

    }).then((res) => {

      console.log('REG search/count_by_person_id_and_ts_epoch');
      console.log(res);

      let regs = res.rows;
      let col_size = Math.ceil(regs.length / 3);
      reg_cols = [];
      has_manual_entry = false;

      regs.forEach((r) => {
        if (r.doc.manual){
          has_manual_entry = true;
          return;
        }
        if (typeof r.doc.nfc_uid === 'undefined'){
          return;
        }

        if (typeof person_nfcs[r.doc.nfc_uid] === 'undefined'){
          let nfc_index = person_nfc_ary.length;
          person_nfcs[r.doc.nfc_uid] = {
            color: nfc_colors[nfc_index % nfc_colors.length],
            label: String.fromCharCode(65 + nfc_index),
            index: nfc_index
          };

          person_nfc_ary = [...person_nfc_ary, r.doc.nfc_uid];
        }

      });

      while (regs.length){
        reg_cols = [...reg_cols, regs.splice(0, col_size)];
      }

      console.log('reg_cols', reg_cols);

    }).catch((err) => {
      console.log(err);
    });
  };

  $: if (person_id){
    update_reg_cols();
  } else {
    open === false;
    reg_count = 0;
  };
</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    {#if $person}
      Registraties&nbsp;
      <PersonTag person={$person} />
    {/if}
  </ModalHeader>
  <ModalBody>
    <Row>
      <Col>
        <SelectListLength {list_length} on:change={() => update_reg_cols()} />
      </Col>
      <Col>
        Totaal: {reg_count}
      </Col>
    </Row>
    <Row>
      {#each reg_cols as col}
        <Col>
          <ListGroup>
            {#each col as reg}
              <ListGroupItem>
                <RegTimeTag reg={reg.doc} />
                {#if reg.doc.nfc_uid}
                  <span
                    class="badge bg-{person_nfcs[reg.doc.nfc_uid].color} me-2"
                    title="NFC {reg.doc.nfc_uid}"
                  >
                    {person_nfcs[reg.doc.nfc_uid].label}
                  </span>
                {/if}
                <LocaleDateString ts_epoch={reg.doc.ts_epoch} title="datum" />
              </ListGroupItem>
            {/each}
          </ListGroup>
        </Col>
      {/each}
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

<ListGroupItem>
  <Button
    disabled={reg_count === 0}
    color={has_manual_entry ? 'warning' : 'accent'}
    on:click={toggle}
    title="Bekijk registraties{has_manual_entry ? ', bevat manuele in laatste 40' : ''}"
  >
    Registraties {reg_count}
  </Button>
</ListGroupItem>
