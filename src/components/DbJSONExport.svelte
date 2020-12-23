<script>
    const { ipcRenderer } = window.require('electron');
    import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
    import { db_reg, db_nfc, db_person } from '../services/db';
    import { download } from './../services/download';

    let open = false;

    const toggle = () => (open = !open);

    ipcRenderer.on('db.json.export', () => {
        open = true
    });

    const handle_export = () => {
        let dbs = {};
        db_nfc.allDocs({
            include_docs: true,
            include_attachments:true
        }).then((res) => {
            dbs.db_nfc = res;
            return db_reg.allDocs({
                include_docs: true,
                include_attachments: true
            });
        }).then((res) => {
            dbs.db_reg = res;
            return db_person.allDocs({
                include_docs: true,
                include_attachments: true
            });
        }).then((res) => {
            dbs.db_person = res;
            return true;
        }).then(() => {
            let time_str = (new Date()).getTime().toString();
            download(JSON.stringify(dbs),
                'db_nfc_reg_person_'+time_str+'.json',
                'application/json');
            open = false;
        }).catch((err) => {
            console.log(err);
        });
    };
</script>

<Modal isOpen={open} {toggle}>
    <ModalHeader {toggle}>
        Export data
    </ModalHeader>
    <ModalBody>
        <Button color=warning on:click={handle_export}>
            Export Db JSON
        </Button>
        <p>
            db_nfc, db_reg, db_person
        </p>
    </ModalBody>
    <ModalFooter>
        <Button color=primary on:click={toggle}>Sluiten</Button>
    </ModalFooter>
</Modal>