<script>
  import { db_person } from '../services/db';
  import { person_map } from '../services/store';
  import { sub_person_map } from '../services/sub';
  import { member_year_person_map } from '../services/store';
  import { build_person_idx } from '../services/build_idx';
  
  const listen_changes = () => {
    console.log('- listen changes db_person -');

    db_person.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {

      if (!change.id.startsWith('n')){
        return;
      }

      console.log('=/ person change ' + change.id, change);

      if (change.deleted){

        member_year_person_map.update((m) => {
          if (!sub_person_map.has(change.id)){
            return m;
          }
          const {member_year} = sub_person_map.get(change.id); 
          Object.keys(member_year ?? {}).forEach((yk) => {
            if (!m.has(yk)){
              return;
            }
            m.get(yk).delete(change.id);
          });       
          return m;
        });        

        person_map.update((m) => {
          m.delete(change.id);
          return m;
        });

        return;
      }

      person_map.update((m) => {
        const member_year = {...change.doc.member_year};
        m.set(change.id, {...change.doc, member_year});
        return m;
      });

      member_year_person_map.update((m) => {
        Object.keys(change.doc.member_year ?? {}).sort().forEach((yk) => {
          if (!m.has(yk)){
            m.set(yk, new Set());
          }
          m.get(yk).add(change.id);
        });
        return m;
      });

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
      m.clear();
      person_ary.forEach((v) => {
        const member_year = {...v.doc.member_year};
        m.set(v.id, {...v.doc, member_year});
      });
      return m;
    });

    member_year_person_map.update((m) => {
      m.clear();
      person_ary.forEach((v) => {
        Object.keys(v.doc.member_year ?? {}).sort().forEach((yk) => {
          if (!m.has(yk)){
            m.set(yk, new Set());
          }
          m.get(yk).add(v.doc._id);
        });
      });
      return m;
    });

    listen_changes();
    build_person_idx();

  }).catch((err) => {
    console.log(err);
  });

</script>
