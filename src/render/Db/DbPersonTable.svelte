<script>
  import { db_person } from '../services/db';
  import { person_map } from '../services/store';

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

        console.log('db_person.changes delete from $person_map ', change);

        person_map.update((m) => {
          m.delete(change.id);
          return m;
        });

        return;
      }

      person_map.update((m) => {
        m.set(change.id, change.doc);
      });

      console.log('db_person.changes $person_map updated', change);

    }).on('error', (err) => {
      console.log(err);
    });

  };

  db_person.allDocs({
    include_docs: true,
    startkey: 'n',
    endkey: 'n\uffff'
  }).then((res) => {

    console.log('load $person_map PERSON RES');
    console.log(res);

    const person_ary = res.rows ?? [];

    person_map.update((m) => {
      person_ary.forEach((v) => {
        m.set(v.id, v.doc);
      });
      return m;
    });

    listen_changes();

  }).catch((err) => {
    console.log(err);
  })

</script>
