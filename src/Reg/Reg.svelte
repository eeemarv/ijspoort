<script>
  import { createEventDispatcher } from 'svelte';
  import { db_reg } from '../services/db';
  import { nfc_uid, person } from './../services/store';

  export const block_time = 3600000; // 1 hour
  const dispatch = createEventDispatcher();

  export const add_by_nfc = (prsn) => {
    $person = undefined;
    let reg = get_base_reg_object(prsn);
    reg.nfc_uid = $nfc_uid;
    add(reg);
  };

  export const add_by_manual = () => {
    let reg = get_base_reg_object($person);
    reg.manual = true;
    add(reg);
    $person = undefined;
  };

  const get_base_reg_object = (person) => {
    const now = new Date();
    const reg = {
        _id: 't' + now.getTime().toString(),
        ts_epoch: now.getTime(),
        person_id: person._id
    };
    return reg;
  }

  const add = (reg) => {
    db_reg.query('search/count_by_person_id_and_ts_epoch', {
      startkey: reg.person_id + '_' + (reg.ts_epoch - block_time).toString(),
      endkey: reg.person_id + '_\uffff',
      limit: 1,
      reduce: false
    }).then((res) => {
      console.log('search/count_by_person_id_and_ts_epoch (no reduce)');
      console.log(res);
      if (res.rows.length > 0){
        dispatch('blocked_reg', {
          reg: reg
        });
        throw 'event blocked_reg: person_already_registered';
      }
      return db_reg.put(reg);
    }).then((res) => {
      console.log('add_reg');
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  };
</script>
