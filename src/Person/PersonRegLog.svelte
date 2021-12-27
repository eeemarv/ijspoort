<script>
  import { Button, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, Row, Col, Badge } from 'sveltestrap';
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

  const update_person_reg_cols = () => {
    person_reg_cols = [];
    person_reg_count = 0;

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
      limit: 30,
      reduce: false
    }).then((res) => {
      console.log(res);
      let regs = res.rows;
      let col_size = Math.ceil(regs.length / 3);
      person_reg_cols = [];
      contains_manual_entry = false;
      regs.forEach((r) => {
        if (r.doc.manual){
          contains_manual_entry = true;
        };
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
        Totaal: {person_reg_count}
        {#if person_reg_count > 30}
          (enkel de laatste 30 worden getoond)
        {/if}
      </Col>
    </Row>
    <Row>
      {#each person_reg_cols as col}
        <Col>
          <ListGroup>
            {#each col as reg}
              <ListGroupItem>
              <RegTimeTag reg={reg.doc} />
              <LocaleDateString ts={reg.doc.ts_epoch} title="datum" />
              </ListGroupItem>
            {/each}
          </ListGroup>
        </Col>
      {/each}
    </Row>
    {#if person_reg_cols.length === 0}
      <p>
        Nog geen registraties.
      </p>
    {/if}
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

<Button
  disabled={person_reg_count === 0}
  color={contains_manual_entry ? 'warning' : 'accent'}
  on:click={toggle}
  title="Bekijk registraties{contains_manual_entry ? ', bevat manuele in laatste 30' : ''}"
>
  Registraties {person_reg_count}
</Button>
