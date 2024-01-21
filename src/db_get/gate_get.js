import { db_gate } from '../db/db';

const gate_get_person_in_count = async (ts_start, ts_end, suppress_time) => {
  let suppressed_count = 0;
  const person_last_ts_map = new Map();
  const person_count_map = new Map();

  return await db_gate.allDocs({
    startkey: 'g' + ts_start,
    endkey: 'g' + ts_end,
    include_docs: true
  }).then((res) => {
    console.log('Count gate unique, res -- allDocs -- ', res);

    res.rows.forEach((v) => {
      if (!v.doc){
        return;
      }
      if (!v.doc.in){
        return;
      }
      if (!v.doc.person_id){
        return;
      }
      const person_id = v.doc.person_id;
      const ts = v.doc.ts_epoch;
      if (person_last_ts_map.has(person_id)){
        if (person_last_ts_map.get(person_id) > (ts - suppress_time)){
          suppressed_count++;
          return;
        }
      }
      person_last_ts_map.set(person_id, ts);
      person_count_map.set(person_id, (person_count_map.get(person_id) ?? 0) + 1);
    });

    return {
      suppressed_count: suppressed_count,
      person_count_map: person_count_map
    };
  });
};

const gate_get_step_count = async (ts_start, ts_end, step_time) => {
  const g_map = new Map();

  return await db_gate.allDocs({
    startkey: 'g' + ts_start,
    endkey: 'g' + ts_end,
    include_docs: true
  }).then((res) => {

    res.rows.forEach((v) => {
      const ts = Math.floor(v.doc.ts_epoch / step_time) * step_time;
      const g = g_map.get(ts) ?? {in: 0, out: 0};

      if (v.doc.in){
        g.in++;
      } else if (v.doc.out){
        g.out--;
      } else {
        return;
      }

      g_map.set(ts, g);
    });

    return g_map;
  });
};

export { gate_get_person_in_count };
export { gate_get_step_count };
