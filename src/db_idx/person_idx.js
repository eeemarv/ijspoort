import { db_person } from '../db/db';

const person_build_idx_by_text = async () => {
  console.log('-- build indexes db_person count_by_text');
  return await db_person.query('search/count_by_text', {
    limit: 0
  });
};

const person_build_idx_by_simular = async () => {
  console.log('-- build indexes db_person count_by_simular');
  return await db_person.query('search/count_by_simular', {
    limit: 0
  });
};

export { person_build_idx_by_text };
export { person_build_idx_by_simular };