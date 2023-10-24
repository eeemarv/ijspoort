<script>
  import { db_person } from '../services/db';
  import { person_table } from '../services/store';

  const listen_changes = () => {

    db_person.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {

      if (!change.id.startsWith('n')){
        return;
      }

      if (change.deleted){

        console.log('db_person.changes $person_table deleted ' + change.id);

        delete $person_table[change.id];
        $person_table = $person_table;

        return;
      }

      console.log('db_person.changes $person_table updated ' + change.id);
      $person_table[change.id] = {...change.doc};

    }).on('error', (err) => {
      console.log(err);
    });

  };

  db_person.allDocs({
    include_docs: true,
    startkey: 'n',
    endkey: 'n\uffff'
  }).then((res) => {

    console.log('load $person_table PERSON RES');
    console.log(res);

    res.rows.forEach((v) => {
      $person_table[v.id] = {...v.doc};
    });

    listen_changes();

  }).catch((err) => {
    console.log(err);
  })

</script>
