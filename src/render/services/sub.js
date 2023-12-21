import { person_map } from './store';
import { tag_type_map } from './store';
import { tag_map } from './store';
import { nfc_map } from './store';
import { gate_in_map } from './store';
import { gate_out_map } from './store';
import { reg_map } from './store';
import { person_last_reg_ts_map } from './store';

let sub_person_map = new Map();
let sub_tag_type_map = new Map();
let sub_tag_map = new Map();
let sub_nfc_map = new Map();
let sub_gate_in_map = new Map();
let sub_gate_out_map = new Map();
let sub_reg_map = new Map();
let sub_person_last_reg_ts_map = new Map();

person_map.subscribe((m) => {
  sub_person_map = m;
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

export { sub_person_map };
export { sub_tag_type_map};
export { sub_tag_map };
export { sub_nfc_map };
export { sub_gate_in_map };
export { sub_gate_out_map };
export { sub_reg_map };
export { sub_person_last_reg_ts_map };
