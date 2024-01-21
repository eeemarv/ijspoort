<script>
  import { db_tag } from '../db/db';
  import { tag_type_map } from '../../services/store';
  import { person_tag_map } from '../../services/store';
  import { tag_types_enabled } from '../../services/store';
  import { tag_map } from '../../services/store';
  import { sub_tag_type_map } from '../../services/sub';

  let last_type_ts_epoch = undefined;
  const last_ts_epoch_map = new Map();

  const tag_type_map_build = async () => {

    return await db_tag.allDocs({
      include_docs: true,
      startkey: '0_',
      endkey: '0_\uffff',
    }).then((res) => {

      console.log('build tag_type_map TAG 0_ RES', res);

      const type_ary = res.rows.sort((a, b) => a.doc.ts_epoch - b.doc.ts_epoch);

      tag_type_map.update((m) => {
        m.clear();
        last_type_ts_epoch = undefined;
            
        type_ary.forEach((v) => {
          m.set(v.id, {...v.doc});
          last_type_ts_epoch = v.doc.ts_epoch;
        });
  
        return m;
      });

      /** cleanup tag_types_enabled */

      tag_types_enabled.update((m) => {
        for (const type_id in m){
          if (!m.hasOwnProperty(type_id)){
            continue;
          }
          if (!sub_tag_type_map.has(type_id)){
            delete m[type_id];
          }          
        }
        return m;
      });

    }).catch((err) => {
      console.log(err);
    });
  };

  const tag_map_build = async (type_id = undefined) => {

    let startkey = 't';

    if (typeof type_id === 'undefined'){
      startkey += '0_';
    } else {
      startkey += type_id + '_';
    }

    return await db_tag.allDocs({
      startkey: startkey,
      endkey: startkey + '\uffff',
      include_docs: true
    }).then((res) => {

      console.log('build tag_map & tag_map, startkey: ' + startkey + ' RES', res);

      tag_map.update((m) => {
        if (typeof type_id === 'undefined'){
          m.clear();          
        } else {
          m.delete(type_id);
        }

        res.rows.forEach((v) => {
          if (!m.has(v.doc.type_id)){
            m.set(v.doc.type_id, new Map());
          }
          m.get(v.doc.type_id).set(v.doc.ts_epoch, v.doc.person_id);
        });

        return m;
      });

      person_tag_map.update((m) => {
        if (typeof type_id === 'undefined'){
          m.clear();
          last_ts_epoch_map.clear();        
        } else {     
          m.forEach((p_map) => {
            p_map.delete(type_id);
          });
          last_ts_epoch_map.delete(type_id);   
        }

        res.rows.forEach((v) => {
          if (!m.has(v.doc.person_id)){
            m.set(v.doc.person_id, new Map());
          }
          const p_map = m.get(v.doc.person_id);

          if (!p_map.has(v.doc.type_id)){
            p_map.set(v.doc.type_id, new Map());
          }
          p_map.get(v.doc.type_id).set(v.doc.ts_epoch, {...v.doc});
          last_ts_epoch_map.set(v.doc.type_id, v.doc.ts_epoch);
        });
        return m;
      });

    }).catch((err) => {
      console.log(err);
    });
  };

  const listen_changes = () => {

    console.log('--- LISTEN CHANGES TAGS ----');

    db_tag.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {

      if (change.deleted && change.id.startsWith('0_')){

        console.log('=// change delete tag_type_map', change);

        tag_type_map.update((m) => {
          m.delete(change.id);
          return m;
        });
        return;
      }

      if (change.deleted && change.id.startsWith('t0_')){

        console.log('== change delete person_tag_map & tag_map', change);

        const id_ary = change.id.substring(3).split('_');
        const type_id = '0_' + id_ary[0];
        const person_id = id_ary[1];
        const ts_epoch = parseInt(id_ary[2]);

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

        return;
      }

      if (change.deleted){
        return;
      }

      if (change.id.startsWith('0_')){

        if (typeof last_type_ts_epoch === 'undefined'
          || last_type_ts_epoch < change.doc.ts_epoch
          || sub_tag_type_map.has(change.id)){

          /**
           * in sequence, add to tag_type_map
          */ 
          console.log('=// change $tag_type_map ', change);

          tag_type_map.update((m) => {
            m.set(change.id, {...change.doc});
            last_type_ts_epoch = change.doc.ts_epoch;
            return m;
          });

          return;  
      
        }

        /**
         * out sequence
        */

        console.log('- tag type change out of sequence, rebuild -', change);

        tag_type_map_build().then(() => {
          console.log('- tag type map rebuild rdone -');
        });

        return;
      }

      if (change.id.startsWith('t0_')){

        if (!last_ts_epoch_map.has(change.doc.type_id)
          || last_ts_epoch_map.get(change.doc.type_id) < change.doc.ts_epoch){
        
          /** 
           * in sequence 
           */
        
          console.log('=// change $person_tag_map & $tag_map', change);

          person_tag_map.update((m) => {
            if (!m.has(change.doc.person_id)){
              m.set(change.doc.person_id, new Map());
            }
            const p_map = m.get(change.doc.person_id);
            if (!p_map.has(change.doc.type_id)){
              p_map.set(change.doc.type_id, new Map());
            }
            p_map.get(change.doc.type_id).set(change.doc.ts_epoch, {...change.doc});
            return m;
          });

          tag_map.update((m) => {
            if (!m.has(change.doc.type_id)){
              m.set(change.doc.type_id, new Map());
            }
            m.get(change.doc.type_id).set(change.doc.ts_epoch, change.doc.person_id);
            last_ts_epoch_map.set(change.doc.type_id, change.doc.ts_epoch);
            return m;
          });
          
          return;  
        }

        /**
         * out sequence
        */
        console.log('- change tag_map, out sequence, rebuild type_id ' + change.doc.type_id);
        
        tag_map_build(chnage.doc.type_id).then(() => {
          console.log('- tap map rebuild, type_id ' + change.doc.type_id);
        }).catch((err) => {
          console.log(err);
        });

        return;
      }

    }).on('error', (err) => {
      console.log(err);
    });
  };

  tag_type_map_build().then(() => {
    return tag_map_build();
  }).then(() => {
    listen_changes();
  }).catch((err) => {
    console.log(err);
  });
</script>
