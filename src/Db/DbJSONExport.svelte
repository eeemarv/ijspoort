<script>
  const env = window.require('electron').remote.process.env;
  const { ipcRenderer } = window.require('electron');
  import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
  import { db_reg, db_nfc, db_person, db_gate, db_tag, db_sensor } from '../services/db';
  import { download } from './../services/download';

  const db_local_prefix = env.DB_LOCAL_PREFIX;
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
      return db_gate.allDocs({
        include_docs: true,
        include_attachments: true
      });
    }).then((res) => {
      dbs.db_gate = res;
      return db_tag.allDocs({
        include_docs: true,
        include_attachments: true
      });
    }).then((res) => {
      dbs.db_tag = res;
      return db_sensor.allDocs({
        include_docs: true,
        include_attachments: true
      });
    }).then((res) => {
      dbs.db_sensor = res;
      return true;
    }).then(() => {
      let time_str = (new Date()).getTime().toString();
      download(JSON.stringify(dbs),
        'db_' + db_local_prefix + time_str+'.json',
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
      db_nfc, db_reg, db_person, db_gate, db_tag, db_sensor
    </p>
  </ModalBody>
  <ModalFooter>
    <Button
      color=primary
      on:click={toggle}
    >
      Sluiten
    </Button>
  </ModalFooter>
</Modal>