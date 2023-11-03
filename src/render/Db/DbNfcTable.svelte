<script>
  import { db_nfc } from '../services/db';
  import { nfc_map } from '../services/store';
  import { person_nfc_map } from '../services/store';

  const listen_changes = () => {

    db_nfc.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {

      if (!change.id.startsWith('uid_'))
      {
        return;
      }

      if (!$nfc_map.has(change.id)){
        return;
      }

      if (change.deleted){

        nfc_map.update((m) => {
          m.delete(change.id);
          return m;
        });

        person_nfc_map.update((m) => {
          if (m.has(change.doc.person_id)){
            m.get(change.doc.person_id).delete(change.id);
            if (!m.get(change.doc.person_id).size){
              m.delete(change.doc.person_id);
            }
          }
          return m;
        });

        console.log('db_nfc.changes $nfc_map deleted ' + change.id);

        return;
      }

      console.log('db_nfc.changes $nfc_map.set');
      console.log(change);

      nfc_map.update((m) => {
        m.set(change.id, change.doc);
        return m;
      });

      person_nfc_map.update((m) => {
        if (m.has(change.doc.person_id)){
          m.get(change.doc.person_id).add(change.id);
          return m;
        }
        m.set(change.doc.person_id, new Set([change.id]));
        return m;
      });

    }).on('error', (err) => {
      console.log(err);
    });
  };

  db_nfc.allDocs({
    include_docs: true,
    startkey: 'uid_',
    endkey: 'uid_\uffff',
  }).then((res) => {

    console.log('load $nfc_map NFC RES');
    console.log(res);

    const nfc_ary = res.rows ?? [];

    nfc_ary.sort((a, b) => {
      return a.doc.ts_epoch - b.doc.ts_epoch;
    });

    nfc_map.update((m) => {
      nfc_ary.forEach((v) => {
        m.set(v.doc._id, v.doc);
      });
      return m;
    });

    person_nfc_map.update((m) => {
      nfc_ary.forEach((v) => {
        if (m.has(v.doc.person_id)){
          m.get(v.doc.person_id).add(v.doc._id);
          return;
        }
        m.set(v.doc.person_id, new Set([v.doc._id]));
      });
      return m;
    });

    listen_changes();

  }).catch((err) => {
    console.log(err);
  });
</script>
