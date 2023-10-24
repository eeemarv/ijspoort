<script>
  import { db_nfc } from '../services/db';
  import { nfc_table } from '../services/store';
  import { person_nfc_table } from '../services/store';
  import { nfc_sorted_ary } from '../services/store';

  const sort_nfc_ary = () => {
    let ary = $nfc_sorted_ary;
    ary.sort((a, b) => b.ts_epoch - a.ts_epoch);
    $nfc_sorted_ary = ary;
  }

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

      if (change.deleted){

        let person_id = $nfc_table[change.id].person_id;

        delete $person_nfc_table[person_id][change.id];
        $person_nfc_table = $person_nfc_table;

        delete $nfc_table[change.id];
        $nfc_table = $nfc_table;

        console.log('db_nfc.changes $nfc_table deleted ' + change.id);

        $nfc_sorted_ary = $nfc_sorted_ary.filter((a) => a.id !== change.id);

        return;
      }

      console.log('db_nfc.changes $nfc_table updated ' + change.id);
      console.log(change);

      $nfc_table[change.id] = {...change.doc};

      if ($person_nfc_table[change.doc.person_id] === undefined){
        $person_nfc_table[change.doc.person_id] = {};
      }

      $person_nfc_table[change.doc.person_id][change.id] = true;

      $nfc_sorted_ary.push({
        ts_epoch: v.doc.ts_epoch,
        id: v.id
      });

      sort_nfc_ary();

    }).on('error', (err) => {
      console.log(err);
    });
  };

  db_nfc.allDocs({
    include_docs: true,
    startkey: 'uid_',
    endkey: 'uid_\uffff',
  }).then((res) => {

    console.log('load $nfc_table NFC RES');
    console.log(res);

    res.rows.forEach((v) => {
      $nfc_table[v.id] = {...v.doc};

      $nfc_sorted_ary.push({
        ts_epoch: v.doc.ts_epoch,
        id: v.id
      });

      if ($person_nfc_table[v.doc.person_id] === undefined){
        $person_nfc_table[v.doc.person_id] = {};
      }

      $person_nfc_table[v.doc.person_id][v.doc._id] = true;
    });

    sort_nfc_ary();
    listen_changes();
  }).catch((err) => {
    console.log(err);
  });
</script>
