<script>
  import { db_person } from '../db/db';
  import { person_map } from '../../services/store';
  import { sub_person_map } from '../../services/sub';
  import { member_year_person_map } from '../../services/store';
  // import { build_person_idx } from '../../services/build_idx';
  
  const person_map_build = async () => {
    console.log('- build person map -');

    return await db_person.allDocs({
      include_docs: true,
      startkey: 'n',
      endkey: 'n\uffff'
    }).then((res) => {

      console.log('person map RES ', res);

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

    }).catch((err) => {
      console.log(err);
    });
  };

  const listen_changes = () => {
    console.log('- listen changes person map -');

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

  person_map_build().then(() => {
    listen_changes();
    // build_person_idx();    
  });

</script>
