import { person_map } from './store';
import { person_nfc_map } from './store';
import { tag_type_map } from './store';
import { tag_map } from './store';
import { person_tag_map } from './store';
import { desk_nfc_auto_tags } from './store';
import { desk_tag_types_enabled } from './store';
import { nfc_map } from './store';
import { gate_in_map } from './store';
import { gate_out_map } from './store';
import { reg_map } from './store';
import { person_last_reg_ts_map } from './store';
import { fresh_reg_ts_map } from './store';
import { desk_nfc_auto_reg_enabled } from './store';
import { gate_nfc_auto_block_enabled } from './store';
import { desk_nfc_auto_open_person_data_enabled } from './store';
import { gate_count_enabled } from './store';
import { gate_count } from './store';
import { gate_open } from './store';
import { members_only_enabled } from './store';
import { gate_member_open_time } from './store';
import { gate_sound_ok_enabled } from './store';
import { gate_sound_error_enabled } from './store';
import { member_period_select } from './store';
import { desk_member_period_filter } from './store';
import { desk_member_period_filter_enabled } from './store';
import { member_person_map } from './store';

let sub_person_map = new Map();
let sub_person_nfc_map = new Map();
let sub_tag_type_map = new Map();
let sub_tag_map = new Map();
let sub_person_tag_map = new Map();
let sub_desk_nfc_auto_tags = {};
let sub_desk_tag_types_enabled = {};
let sub_nfc_map = new Map();
let sub_gate_in_map = new Map();
let sub_gate_out_map = new Map();
let sub_reg_map = new Map();
let sub_person_last_reg_ts_map = new Map();
let sub_fresh_reg_ts_map = new Map();
let sub_desk_nfc_auto_reg_enabled = false;
let sub_gate_nfc_auto_block_enabled = false;
let sub_desk_nfc_auto_open_person_data_enabled = false;
let sub_gate_count_enabled = false;
let sub_gate_count = 0;
let sub_gate_open = true;
let sub_members_only_enabled = false;
let sub_gate_member_open_time = 12;
let sub_gate_sound_ok_enabled = false;
let sub_gate_sound_error_enabled = false;
let sub_member_period_select = null;
let sub_desk_member_period_filter = null;
let sub_desk_member_period_filter_enabled = false;
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

desk_nfc_auto_tags.subscribe((o) => {
  sub_desk_nfc_auto_tags = o;
});

desk_tag_types_enabled.subscribe((o) => {
  sub_desk_tag_types_enabled = o;
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

fresh_reg_ts_map.subscribe((m) => {
  sub_fresh_reg_ts_map = m;
});

desk_nfc_auto_reg_enabled.subscribe((b) => {
  sub_desk_nfc_auto_reg_enabled = b;
});

gate_nfc_auto_block_enabled.subscribe((b) => {
  sub_gate_nfc_auto_block_enabled = b;
});

desk_nfc_auto_open_person_data_enabled.subscribe((b) => {
  sub_desk_nfc_auto_open_person_data_enabled = b;
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

members_only_enabled.subscribe((b) => {
  sub_members_only_enabled = b;
});

gate_member_open_time.subscribe((i) => {
  sub_gate_member_open_time = i;
});

gate_sound_ok_enabled.subscribe((b) => {
  sub_gate_sound_ok_enabled = b;
});

gate_sound_error_enabled.subscribe((b) => {
  sub_gate_sound_error_enabled = b;
});

member_period_select.subscribe((s) => {
  sub_member_period_select = s;
});

desk_member_period_filter.subscribe((s) => {
  sub_desk_member_period_filter = s;
});

desk_member_period_filter_enabled.subscribe((b) => {
  sub_desk_member_period_filter_enabled = b;
});

member_person_map.subscribe((m) => {
  sub_member_person_map = m;
});

export { sub_person_map };
export { sub_person_nfc_map };
export { sub_tag_type_map};
export { sub_tag_map };
export { sub_person_tag_map };
export { sub_desk_nfc_auto_tags };
export { sub_desk_tag_types_enabled };
export { sub_nfc_map };
export { sub_gate_in_map };
export { sub_gate_out_map };
export { sub_reg_map };
export { sub_person_last_reg_ts_map };
export { sub_fresh_reg_ts_map };
export { sub_desk_nfc_auto_reg_enabled };
export { sub_gate_nfc_auto_block_enabled };
export { sub_desk_nfc_auto_open_person_data_enabled };
export { sub_gate_count_enabled };
export { sub_gate_count };
export { sub_gate_open };
export { sub_members_only_enabled };
export { sub_gate_member_open_time };
export { sub_gate_sound_ok_enabled };
export { sub_gate_sound_error_enabled };
export { sub_member_period_select };
export { sub_desk_member_period_filter };
export { sub_desk_member_period_filter_enabled };
export { sub_member_person_map };
