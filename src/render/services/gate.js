import { db_gate } from './db';
import { gate_count } from './store';
import { gate_count_enabled } from './store';

let flood_in_blocked = false;
let flood_out_blocked = false;
const flood_block_time = 200;

let g_count = undefined;
let g_count_enabled = false;

gate_count_enabled.subscribe((b) => {
  g_count_enabled = b;
});
gate_count.subscribe((v) => {
  g_count = v;
});

const gate_in_add = (person_id, nfc_uid) => {

  if (flood_in_blocked){
    console.log('flood_in_blocked gate_in_add');
    return;
  }
  flood_in_blocked = true;

  const ts_epoch = (new Date()).getTime();
  const gate = {
    ts_epoch: ts_epoch,
    _id: 'g' + ts_epoch.toString(),
    in: true
  };

  if (person_id !== undefined){
    gate.person_id = person_id;
  }

  if (nfc_uid !== undefined){
    gate.nfc_uid = nfc_uid;
  }

  if (g_count_enabled && g_count !== undefined){
    gate.count = g_count;
  }

  db_gate.put(gate).then((res) => {
    console.log('db_gate.put');
    console.log(res);

    setTimeout(() => {
      flood_in_blocked = false;
    }, flood_block_time);

  }).catch((err) => {
    console.log('ERR db_reg.put');
    console.log(err);
  });
};

const gate_out_add = () => {

  if (flood_out_blocked){
    console.log('flood_out_blocked gate_out_add');
    return;
  }
  flood_out_blocked = true;

  const ts_epoch = (new Date()).getTime();
  const gate = {
    ts_epoch: ts_epoch,
    _id: 'g' + ts_epoch.toString(),
    out: true
  };

  if (g_count_enabled && g_count !== undefined){
    gate.count = g_count;
  }

  db_gate.put(gate).then((res) => {
    console.log('db_gate.put');
    console.log(res);

    setTimeout(() => {
      flood_out_blocked = false;
    }, flood_block_time);

  }).catch((err) => {
    console.log('ERR db_reg.put');
    console.log(err);
  });
};

export { gate_in_add };
export { gate_out_add };
