import { person_map } from './store';
import { person_nfc_map } from './store';
import { tag_type_map } from './store';
import { tag_map } from './store';
import { nfc_map } from './store';
import { gate_in_map } from './store';
import { gate_out_map } from './store';
import { reg_map } from './store';
import { person_last_reg_ts_map } from './store';
import { reg_nfc_auto_enabled } from './store';
import { nfc_block_enabled } from './store';
import { nfc_gate_auto_block_enabled } from './store';
import { person_nfc_auto_enabled } from './store';
import { gate_count_enabled } from './store';
import { gate_count } from './store';

let sub_person_map = new Map();
let sub_person_nfc_map = new Map();
let sub_tag_type_map = new Map();
let sub_tag_map = new Map();
let sub_nfc_map = new Map();
let sub_gate_in_map = new Map();
let sub_gate_out_map = new Map();
let sub_reg_map = new Map();
let sub_person_last_reg_ts_map = new Map();
let sub_reg_nfc_auto_enabled = false;
let sub_nfc_block_enabled = false;
let sub_nfc_gate_auto_block_enabled = false;
let sub_person_nfc_auto_enabled = false;
let sub_gate_count_enabled = false;
let sub_gate_count = 0;

person_map.subscribe((m) => {
  sub_person_map = m;
});

person_nfc_map.subscribe((m) => {
  sub_person_nfc_map = m;
});

tag_type_map.subscribe((m) => {
  sub_tag_type_map = m;
});

tag_map.subscribe((m) => {
  sub_tag_map = m;
});

nfc_map.subscribe((m) => {
  sub_nfc_map = m;
});

gate_in_map.subscribe((m) => {
  sub_gate_in_map = m;
});

gate_out_map.subscribe((m) => {
  sub_gate_out_map = m;
});

reg_map.subscribe((m) => {
  sub_reg_map = m;
});

person_last_reg_ts_map.subscribe((m) => {
  sub_person_last_reg_ts_map = m;
});

reg_nfc_auto_enabled.subscribe((b) => {
  sub_reg_nfc_auto_enabled = b;
});

nfc_block_enabled.subscribe((b) => {
  sub_nfc_block_enabled = b;
});

nfc_gate_auto_block_enabled.subscribe((b) => {
  sub_nfc_gate_auto_block_enabled = b;
});

person_nfc_auto_enabled.subscribe((b) => {
  sub_person_nfc_auto_enabled = b;
});

gate_count_enabled.subscribe((b) => {
  sub_gate_count_enabled = b;
});

gate_count.subscribe((i) => {
  sub_gate_count = i;
});

export { sub_person_map };
export { sub_person_nfc_map };
export { sub_tag_type_map};
export { sub_tag_map };
export { sub_nfc_map };
export { sub_gate_in_map };
export { sub_gate_out_map };
export { sub_reg_map };
export { sub_person_last_reg_ts_map };
export { sub_reg_nfc_auto_enabled };
export { sub_nfc_block_enabled };
export { sub_nfc_gate_auto_block_enabled };
export { sub_person_nfc_auto_enabled };
export { sub_gate_count_enabled };
export { sub_gate_count };
