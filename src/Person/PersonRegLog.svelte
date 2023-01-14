<script>
  import { Button, ListGroup, ListGroupItem } from 'sveltestrap';
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { Row, Col, Badge } from 'sveltestrap';
  import { FormGroup, Label } from 'sveltestrap';
  import { db_reg } from '../services/db';
  import { person } from './../services/store';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import PersonTag from './PersonTag.svelte';
  import RegTimeTag from '../Reg/RegTimeTag.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';

  let open = false;
  const toggle = () => (open = !open);

  let person_reg_cols = [];
  let person_reg_count = 0;
  let contains_manual_entry = false;
  let person_nfcs = {};
  let person_nfc_ary = [];
  let list_length = 25;

  const list_length_options = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000];
  const nfc_colors = ['blue', 'pink', 'red', 'orange', 'yellow', 'green', 'cyan', 'grey'];

  const update_person_reg_cols = () => {
    person_reg_cols = [];
    person_nfcs = {};
    person_nfc_ary = [];

    if (!$person){
      open = false;
      return;
    }

    db_reg.query('search/count_by_person_id_and_ts_epoch', {
      startkey: $person._id + '_',
      endkey: $person._id + '_\uffff',
      reduce: true
    }).then((res) => {
      console.log('person_reg_count');
      console.log(res);
      person_reg_count = res.rows[0].value;
    }).catch((err) => {
      console.log(err);
    });

    db_reg.query('search/count_by_person_id_and_ts_epoch', {
      startkey: $person._id + '_\uffff',
      endkey: $person._id + '_',
      descending: true,
      include_docs: true,
      limit: list_length,
      reduce: false
    }).then((res) => {
      console.log('REG search/count_by_person_id_and_ts_epoch');
      console.log(res);
      let regs = res.rows;
      let col_size = Math.ceil(regs.length / 3);
      person_reg_cols = [];
      contains_manual_entry = false;
      regs.forEach((r) => {
        if (r.doc.manual){
          contains_manual_entry = true;
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
        person_reg_cols = [...person_reg_cols, regs.splice(0, col_size)];
      }
      console.log('person_reg_cols', person_reg_cols);
    }).catch((err) => {
      console.log(err);
    });
  };

  $: if ($person){
    update_person_reg_cols();
  }

  $: if (!$person){
    open === false;
  }
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
        <FormGroup>
          <Label for=list_length>Toon maximaal aantal in lijst</Label>
          <select id=list_length bind:value={list_length} class=form-control name=list_length on:change={() => update_person_reg_cols()}>
            {#each list_length_options as l (l)}
              <option>{l}</option>
            {/each}
          </select>
        </FormGroup>
      </Col>
      <Col>
        Totaal: {person_reg_count}
      </Col>
    </Row>
    <Row>
      {#each person_reg_cols as col}
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
                <LocaleDateString ts={reg.doc.ts_epoch} title="datum" />
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
    disabled={person_reg_count === 0}
    color={contains_manual_entry ? 'warning' : 'accent'}
    on:click={toggle}
    title="Bekijk registraties{contains_manual_entry ? ', bevat manuele in laatste 40' : ''}"
  >
    Registraties {person_reg_count}
  </Button>
</ListGroupItem>
