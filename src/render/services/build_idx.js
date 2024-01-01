import { db_person } from './db';

const build_person_idx = () => {
  console.log('build indexes db_person count_by_text');
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

export { build_person_idx };
