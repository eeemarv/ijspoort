<script>
  import { db_person } from '../services/db';
  import { person_map } from '../services/store';
  import { person_member_year_count_map } from '../services/store';

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

        if ($person_map.get(change.id).member_year){
          person_member_year_count_map.update((m) => {
            Object.keys(change.doc.member_year).forEach((y) => {
              if (!m.has(y)){
                return;
              }
              const count = m.get(y);
              if (count === 1){
                m.delete(y);
                return;
              }
              m.set(y, count - 1);
              return;
            });
            return m;
          });
        }

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

      if (change.doc.member_year === undefined){
        return;
      }

      person_member_year_count_map.update((m) => {
        Object.keys(change.doc.member_year).forEach((y) => {
          if (!m.has(y)){
            m.set(y, 1);
            return;
          }
          m.set(y, m.get(y) + 1);
        });
        return m;
      });

      console.log('db_person.changes $person_map updated', change);

      console.log('db_person.changes $person_member_year_count_map updated');
      console.log($person_member_year_count_map);

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

    person_member_year_count_map.update((m) => {
      person_ary.forEach((v) => {
        if (v.doc.member_year === undefined){
          return;
        }
        Object.keys(v.doc.member_year).forEach((y) => {
          if (!m.has(y)){
            m.set(y, 1);
            return;
          }
          m.set(y, m.get(y) + 1);
        });
      });
      return m;
    });

    console.log('-- $person_member_year_count_map --');
    console.log($person_member_year_count_map);

    listen_changes();

  }).catch((err) => {
    console.log(err);
  })

</script>
