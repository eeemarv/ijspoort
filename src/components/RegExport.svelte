<script>
    const { ipcRenderer } = window.require('electron');
    import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
    let open = false;
    const toggle = () => (open = !open);

    ipcRenderer.on('csv.reg.export', () => {open = true});
</script>

<Modal isOpen={open} {toggle}>
    <ModalHeader {toggle}>
        Exporteer registraties
    </ModalHeader>
    <ModalBody>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
    </ModalBody>
    <ModalFooter>
        <Button color=secondary on:click={toggle}>Annuleren</Button>
        <Button color=primary on:click={toggle}>CSV bestand</Button>
    </ModalFooter>
</Modal>