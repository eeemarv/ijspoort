import { db_person } from '../db/db';
import { person_map } from '../services/store';
import { sub_person_map } from '../services/sub';
import { member_person_map } from '../services/store';

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
        const member_in = [...v.doc.member_in];
        m.set(v.id, {...v.doc, member_in});
      });
      return m;
    });

    member_person_map.update((m) => {
     m.clear();
     person_ary.forEach((v) => {
      (v.doc.member_in ?? []).forEach((member_period) => {
        if (!m.has(member_period)){
          m.set(member_period, new Set());
        }
        m.get(member_period).add(v.id);
      })
     });
     return m;
    });

  }).catch((err) => {
    console.log(err);
  });
};

const person_map_listen_changes = () => {
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

      member_person_map.update((m) => {
        if (!sub_person_map.has(change.id)){
          return m;
        }
        const {member_in} = sub_person_map.get(change.id);
        (member_in ?? []).forEach((member_period) => {
          if (!m.has(member_period)){
            return;
          }
          m.get(member_period).delete(change.id);
          if (m.get(member_period).size === 0){
            m.delete(member_period);
          }
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
      const member_in = [...change.doc.member_in];
      m.set(change.id, {...change.doc, member_in});
      return m;
    });

    member_person_map.update((m) => {
      (change.doc.member_in ?? []).sort().forEach((member_period) => {
        if (!m.has(member_period)){
          m.set(member_period, new Set());
        }
        m.get(member_period).add(change.id);
      });
      return m;
    });

  }).on('error', (err) => {
    console.log(err);
  });
};

export { person_map_build };
export { person_map_listen_changes };
