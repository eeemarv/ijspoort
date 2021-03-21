<script>
    import { Progress } from 'sveltestrap';
    import { Button } from 'sveltestrap';
    import { Modal, ModalHeader, ModalBody, ModalFooter } from 'sveltestrap';

    export let open = false;
    export let title = '';
    export let message = '';
    export let progress = 0;

    const toggle = () => {
        open = !open;
        pogress = 0;
    };
</script>

<Modal isOpen={open} toggle={toggle}>
    <ModalHeader>
        {title}
    </ModalHeader>
    <ModalBody>
        <Progress value={progress} color=light/>
        {message}
    </ModalBody>
    <ModalFooter>
        <Button color=secondary on:click={toggle}>
            Sluiten
        </Button>
    </ModalFooter>
</Modal>
