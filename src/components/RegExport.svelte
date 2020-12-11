<script>
    const { ipcRenderer } = window.require('electron');
    import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
    import { db_reg, db_nfc, db_person } from './../services/pouchdb';

    let open = false;

    const toggle = () => (open = !open);

    ipcRenderer.on('csv.reg.export', () => {
        open = true
    });

    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

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
                'db_nfc_reg_person_'+time_str+'.db',
                'text/plain');
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
            Export nfc-reg-person
        </Button>

    </ModalBody>
    <ModalFooter>
        <Button color=primary on:click={toggle}>Sluiten</Button>
    </ModalFooter>
</Modal>