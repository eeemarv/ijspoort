<script>
  import { db_tag } from '../services/db';

  import { tag_type_table } from '../services/store';
  import { person_tag_table } from '../services/store';
  import { tag_count_table } from '../services/store';

  import { tag_type_map } from '../services/store';
  import { person_tag_map } from '../services/store';
  import { tag_map } from '../services/store';

  const listen_changes = () => {

    console.log('--- LISTEN CHANGES TAGS ----');

    db_tag.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {

      if (change.deleted){

        if (change.id.startsWith('0_')){
          console.log('=// change delete $tag_type_map', change);

          tag_type_map.update((m) => {
            m.delete(change.id);
            return m;
          });
        }

        if (change.id.startsWith('t0_')){

          console.log('== change delete $person_tag_map & tag_map', change);

          const a = v.id.substring(3);
          const b = a.split('_');
          const type_id = '0_' + b[0];
          const person_id = b[1];
          const ts_epoch = parseInt(b[2]);

          person_tag_map.update((m) => {
            if (!m.has(person_id)){
              return m;
            }
            const p_map = m.get(person_id);
            if (!p_map.has(type_id)){
              return m;
            }
            p_map.get(type_id).delete(ts_epoch);
            return m;
          });

          tag_map.update((m) => {
            if (!m.has(type_id)){
              return m;
            }
            m.get(type_id).delete(ts_epoch);
            return m;
          });
        }

        return;
      }

      if (change.id.startsWith('0_')){

        console.log('=// change $tag_type_map ', change);

        tag_type_map.update((m) => {
          m.set(change.id, {...change.doc});
          return m;
        });

        return;
      }

      if (change.id.startsWith('t0_')){

        console.log('=// change $person_tag_map & $tag_map', change);

        person_tag_map.update((m) => {
          if (!m.has(change.doc.person_id)){
            m.set(change.doc.person_id, new Map());
          }
          const p_map = m.get(change.doc.person_id);
          if (!p_map.has(change.doc.type_id)){
            p_map.set(change.doc.type_id, new Set());
          }
          p_map.get(change.doc.type_id).add(change.doc.ts_epoch);
          return m;
        });

        tag_map.update((m) => {
          if (!m.has(change.doc.type_id)){
            m.set(change.doc.type_id, new Map());
          }
          m.get(change.doc.type_id).set(change.doc.ts_epoch, change.doc.person_id);
          return m;
        });
      }

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

    /**
     * to remove start
     */ 
    let tt_table = {};

    res.rows.forEach((v) => {
      tt_table[v.id] = {...v.doc};
    });

    $tag_type_table = {...tt_table};
    /**
     * to remove end
    */

    tag_type_map.update((m) => {
      m.clear();
      res.rows.forEach((v) => {
        m.set(v.id, {...v.doc});
      });
      return m;
    });

    return db_tag.allDocs({
      startkey: 't0_',
      endkey: 't0_\uffff',
      include_docs: true
    });

  }).then((res) => {

    console.log('load $person_tag_map TAG t0_ RES');
    console.log(res);

    /**
     * to remove start
     */
    let pt_table = {};
    let c_table = {};

    res.rows.forEach((v) => {
      let a = v.id.substring(3);
      let b = a.split('_');
      let type_id = '0_' + b[0];
      let person_id = b[1];
      let ts_epoch = parseInt(b[2]);

      if (pt_table[person_id] === undefined){
        pt_table[person_id] = {};
      }

      if (pt_table[person_id][type_id] === undefined){
        pt_table[person_id][type_id] = [];
      }

      pt_table[person_id][type_id].push(ts_epoch);

      if (c_table[type_id] === undefined){
        c_table[type_id] = 0;
      }

      c_table[type_id]++;
    });

    $person_tag_table = {...pt_table};
    $tag_count_table = {...c_table};

    /**
     * to remove end
    */

    tag_map.update((m) => {
      m.clear();
      res.rows.forEach((v) => {
        if (!m.has(v.doc.type_id)){
          m.set(v.doc.type_id, new Map());
        }
        m.get(v.doc.type_id).set(v.doc.ts_epoch, v.doc.person_id);
      });
      return m;
    });

    person_tag_map.update((m) => {
      m.clear();
      res.rows.forEach((v) => {
        if (!m.has(v.doc.person_id)){
          m.set(v.doc.person_id, new Map());
        }
        const p_map = m.get(v.doc.person_id);
        if (!p_map.has(v.doc.type_id)){
          p_map.set(v.doc.type_id, new Set());
        }
        p_map.get(v.doc.type_id).add(v.doc.ts_epoch);
      });
      return m;
    });

    listen_changes();

  }).catch((err) => {
    console.log(err);
  });
</script>
