import { person_map } from './store';
import { person_member_year_count_map } from './store';
import { db_person } from './db';

const update_person_map = (person_ary) => {

  for (const [yk, yk_set] of c_map){
    console.log('++ ' + yk + ' :: ' + yk_set.size);
  }

  person_map.update((m) => {
    m.clear();
    person_ary.forEach((v) => {
      m.set(v.id, v.doc);
    });
    return m;
  });

  person_member_year_count_map.update((m) => {
    m.clear();
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

  console.log('*** B person');
  console.log('build indexes db_person search/count_by_text');

  db_person.query('search/count_by_text', {
    limit: 0
  }).then((res) => {
    console.log('build indexes db_person search/count_by_simular');
    return db_person.query('search/count_by_simular', {
      limit: 0
    });
  }).catch((err) => {
    console.log(err);
  });
};

export {update_person_map};