<script>
    import { Container, Row, Col } from 'sveltestrap';
    import ManualAutocomplete from './ManualAutocomplete.svelte';
    import RegList from './RegList.svelte';
    import EID from './EID.svelte';
    import NFC from './NFC.svelte';
    const { ipcRenderer } = window.require('electron');

//    import Modal from './Modal.svelte';
    import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from 'sveltestrap';
  let open = false;
  const toggle = () => (open = !open);

  ipcRenderer.on('csv.reg.export', () => {open = true});
</script>

<Modal isOpen={open} {toggle}>
  <ModalHeader {toggle}>Exporteer registraties</ModalHeader>
  <ModalBody>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua.
  </ModalBody>
  <ModalFooter>
    <Button color=secondary on:click={toggle}>Annuleren</Button>
    <Button color=primary on:click={toggle}>CSV bestand</Button>
  </ModalFooter>
</Modal>

<Container fluid=true>
  <Row class=vh-100>
    <Col md=9 class=vh-100>
      <ManualAutocomplete/>
      <RegList/>
    </Col>

    <Col md=3 class="bg-primary h-100">
      <Row class=h-25>
        <Col>
            <EID/>
            <NFC/>
        </Col>
      </Row>

      <Row class=h-25>
        <Col>
        </Col>
      </Row>

      <Row class=h-25>
        <Col>
        </Col>
      </Row>

      <Row class=h-25>
        <Col class=p-5>
            <h1>ijspoort</h1>
        </Col>
      </Row>

    </Col>
  </Row>
</Container>