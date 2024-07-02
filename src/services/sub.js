import { person_map } from './store';
import { person_nfc_map } from './store';
import { tag_type_map } from './store';
import { tag_map } from './store';
import { person_tag_map } from './store';
import { auto_tag_on_nfc } from './store';
import { tag_types_enabled } from './store';
import { nfc_map } from './store';
import { gate_in_map } from './store';
import { gate_out_map } from './store';
import { reg_map } from './store';
import { person_last_reg_ts_map } from './store';
import { reg_nfc_auto_enabled } from './store';
import { nfc_gate_auto_block_enabled } from './store';
import { person_nfc_auto_enabled } from './store';
import { gate_count_enabled } from './store';
import { gate_count } from './store';
import { gate_open } from './store';
import { gate_nfc_enabled } from './store';
import { gate_nfc_open_time } from './store';
import { sound_ok_enabled } from './store';
import { sound_error_enabled } from './store';
import { focus_year } from './store';
import { focus_year_filter_enabled } from './store';

import { member_period_select } from './store';
import { member_period_filter } from './store';
import { member_person_map } from './store';

let sub_person_map = new Map();
let sub_person_nfc_map = new Map();
let sub_tag_type_map = new Map();
let sub_tag_map = new Map();
let sub_person_tag_map = new Map();
let sub_auto_tag_on_nfc = {};
let sub_tag_types_enabled = {};
let sub_nfc_map = new Map();
let sub_gate_in_map = new Map();
let sub_gate_out_map = new Map();
let sub_reg_map = new Map();
let sub_person_last_reg_ts_map = new Map();
let sub_reg_nfc_auto_enabled = false;
let sub_nfc_gate_auto_block_enabled = false;
let sub_person_nfc_auto_enabled = false;
let sub_gate_count_enabled = false;
let sub_gate_count = 0;
let sub_gate_open = true;
let sub_gate_nfc_enabled = false;
let sub_gate_nfc_open_time = 12;
let sub_sound_ok_enabled = false;
let sub_sound_error_enabled = false;
let sub_focus_year = 0;
let sub_focus_year_filter_enabled = false;
let sub_member_period_select = null;
let sub_member_period_filter = null;
let sub_member_person_map = new Map();

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

person_tag_map.subscribe((m) => {
  sub_person_tag_map = m;
});

auto_tag_on_nfc.subscribe((o) => {
  sub_auto_tag_on_nfc = o;
});

tag_types_enabled.subscribe((o) => {
  sub_tag_types_enabled = o;
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

gate_open.subscribe((b) => {
  sub_gate_open = b;
});

gate_nfc_enabled.subscribe((b) => {
  sub_gate_nfc_enabled = b;
});

gate_nfc_open_time.subscribe((i) => {
  sub_gate_nfc_open_time = i;
});

sound_ok_enabled.subscribe((b) => {
  sub_sound_ok_enabled = b;
});

sound_error_enabled.subscribe((b) => {
  sub_sound_error_enabled = b;
});

focus_year.subscribe((i) => {
  sub_focus_year = i;
});

focus_year_filter_enabled.subscribe((b) => {
  sub_focus_year_filter_enabled = b;
});

member_period_select.subscribe((s) => {
  sub_member_period_select = s;
});

member_period_filter.subscribe((b) => {
  sub_member_period_filter = b;
});

member_person_map.subscribe((m) => {
  sub_member_person_map = m;
});

export { sub_person_map };
export { sub_person_nfc_map };
export { sub_tag_type_map};
export { sub_tag_map };
export { sub_person_tag_map };
export { sub_auto_tag_on_nfc };
export { sub_tag_types_enabled };
export { sub_nfc_map };
export { sub_gate_in_map };
export { sub_gate_out_map };
export { sub_reg_map };
export { sub_person_last_reg_ts_map };
export { sub_reg_nfc_auto_enabled };
export { sub_nfc_gate_auto_block_enabled };
export { sub_person_nfc_auto_enabled };
export { sub_gate_count_enabled };
export { sub_gate_count };
export { sub_gate_open };
export { sub_gate_nfc_enabled };
export { sub_gate_nfc_open_time };
export { sub_sound_ok_enabled };
export { sub_sound_error_enabled };
export { sub_focus_year };
export { sub_focus_year_filter_enabled };
export { sub_member_period_select };
export { sub_member_period_filter };
export { sub_member_person_map };
