import { db_reg } from '../db/db';

const reg_build_idx_by_person_id = async () => {
  console.log('-- build indexes db_reg by_person_id');
  return await db_reg.query('search/count_by_person_id', {
    limit: 0
  });
};

export { reg_build_idx_by_person_id };
