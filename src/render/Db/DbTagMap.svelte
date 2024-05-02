<script>
  import { db_tag } from '../services/db';
  import { person_tag_map } from '../services/store';
  import { tag_count_map } from '../services/store';
  import { tag_type_map } from '../services/store';

  const listen_changes = () => {

    console.log('-------- LISTEN CHANGES TAGS ----');

    db_tag.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {

      if (change.deleted){

        if (change.id.startsWith('0_')){

          tag_type_map.update((m) => {
            m.delete(change.id);
            return m;
          });

          tag_count_map.update((m) => {
            m.delete(change.id);
            return m;
          })

          console.log('== change delete $tag_type_map ', change);
          return;
        }

        if (change.id.startsWith('t0_')){

          console.log('== change delete $person_tag_map ', change);

          const id_parts = change.id.split('_');
          const type_id = '0_' + id_parts[1];
          const person_id = id_parts[2];
          const ts_epoch = parseInt(id_parts[3]);

          tag_count_map.update((m) => {
            const count = m.get(type_id) ?? 0;
            const new_count = count < 1 ? 0 : count - 1;
            m.set(type_id, new_count);
            return m;
          });

          person_tag_map.update((m) => {
            const pt_map = m.get(person_id);
            if (pt_map === undefined){
              return m;
            }
            const t_set = pt_map.get(type_id);
            if (t_set === undefined){
              return m;
            }
            t_set.delete(ts_epoch);
            return m;
          });

          return;
        }

        console.log('== tag change delete > not stored in table', change);

        return;
      }

      if (change.id.startsWith('0_')){

        console.log('== change $tag_type_map ', change);

        tag_type_map.update((m) => {
          m.set(change.id, change.doc);
          return m;
        });

        return;
      }

      if (change.id.startsWith('t0_')){

        console.log('== change $person_tag_map', change);

        let person_id = change.doc.person_id;
        let type_id = change.doc.type_id;
        let ts_epoch = change.doc.ts_epoch;

        person_tag_map.update((m) => {
          if (!m.has(person_id)){
            m.set(person_id, new Map());
          }
          const pt_map = m.get(person_id);
          if (!pt_map.has(type_id)){
            pt_map.set(type_id, new Set());
          }
          const t_set = pt_map.get(type_id);
          t_set.add(ts_epoch);
          return m;
        });

        tag_count_map.update((m) => {
          m.set(type_id, (m.get(type_id) ?? 0) + 1);
          return m;
        });

        return;
      }

      console.log('== tag change > not stored in map', change);

    }).on('error', (err) => {
      console.log(err);
    });
  };

  db_tag.allDocs({
    include_docs: true,
    startkey: '0_',
    endkey: '0_\uffff',
  }).then((res) => {

    console.log('load $tag_type_map TAG 0_ RES');
    console.log(res);

    const sorted_rows = res.rows.sort((a, b) => {
      return a.doc.ts_epoch - b.doc.ts_epoch;
    });

    tag_type_map.update((m) => {
      sorted_rows.forEach((v) => {
        m.set(v.id, v.doc);
      });
      return m;
    });

    console.log('=====$tag_type_map====');
    console.log($tag_type_map);

    return db_tag.allDocs({
      startkey: 't0_',
      endkey: 't0_\uffff',
      include_docs: true
    });

  }).then((res) => {

    console.log('load $person_tag_map TAG t0_ RES');
    console.log(res);

    person_tag_map.update((m) => {
      res.rows.forEach((v) => {
        if (!m.has(v.doc.person_id)){
          m.set(v.doc.person_id, new Map());
        }
        const pt_map = m.get(v.doc.person_id);
        if (!pt_map.has(v.doc.type_id)){
          pt_map.set(v.doc.type_id, new Set());
        }
        const ts_set = pt_map.get(v.doc.type_id);
        ts_set.add(v.doc.ts_epoch);
      });
      return m;
    });

    tag_count_map.update((m) => {
      res.rows.forEach((v) => {
        m.set(v.doc.type_id, (m.get(v.doc.type_id) ?? 0) + 1);
      });
      return m;
    });

    console.log('=====$person_tag_map====');
    console.log($person_tag_map);
    console.log('=====$tag_count_map====');
    console.log($tag_count_map);

    listen_changes();

  }).catch((err) => {
    console.log(err);
  });
</script>
