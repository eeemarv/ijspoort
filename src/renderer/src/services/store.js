import { writable } from 'svelte/store';

const create_coupled_estore = (key, default_value, min_value, max_value) => {
  const val = window.bridge.getFromStore(key, default_value);
	const { subscribe, set, update } = writable(val);
  const store = (n) => {
    if (max_value){
      n = n > max_value ? max_value : n;
    }
    if (min_value){
      n = n < min_value ? min_value : n;
    }
    window.bridge.setToStore(key, n);
    return n;
  };
	return {
		subscribe,
    inc: () => update((n) => {
      n++;
      return store(n);
    }),
    dec: () => update((n) => {
      n--;
      return store(n);
    }),
    set: (n) => {
      set(store(n));
    },
    update: (fn) => {
      set(store(fn(val)))
    }
	};
};

export const gate_open = writable(true);
export const gate_count = create_coupled_estore('gate_count', 50, -99, 999);
export const gate_count_enabled = writable(false);
export const gate_member_open_time = create_coupled_estore('gate_member_open_time', 12, 6, 20);
export const gate_nfc_auto_block_enabled = create_coupled_estore('gate_nfc_auto_block_enabled', false);

export const members_only_enabled = create_coupled_estore('members_only_enabled', false);
export const member_period_select = create_coupled_estore('member_period_select', '');

export const desk_nfc_clear_button_enabled = create_coupled_estore('desk_nfc_clear_button_enabled', false);
export const desk_nfc_read_test_button_enabled = create_coupled_estore('desk_nfc_read_test_button_enabled', false);
export const temperature_card_enabled = create_coupled_estore('temperature_card_enabled', false);
//rm
export const focus_year = create_coupled_estore('focus_year', 2022, 2016, 2030);

export const desk_gate_card_enabled = create_coupled_estore('desk_gate_card_enabled', true);

export const desk_member_period_import = create_coupled_estore('desk_member_period_import', '');
export const desk_member_period_filter = create_coupled_estore('desk_member_period_filter', '');
export const desk_member_data_update = writable(true);
export const desk_member_period_filter_enabled = create_coupled_estore('desk_member_period_filter_enabled', false);

export const gate_beep_enabled = create_coupled_estore('gate_beep_enabled', true);
export const gate_sound_ok_enabled = create_coupled_estore('gate_sound_ok_enabled', false);
export const gate_sound_error_enabled = create_coupled_estore('gate_sound_error_enabled', false);

export const desk_nfc_auto_open_person_data_enabled = create_coupled_estore('desk_nfc_auto_open_person_data_enabled', true);
export const desk_nfc_auto_reg_enabled = create_coupled_estore('desk_nfc_auto_reg_enabled', false);
export const desk_reg_delete_buttons_enabled = create_coupled_estore('desk_reg_delete_buttons_enabled', false);

export const desk_tag_card_enabled = create_coupled_estore('desk_tag_card_enabled', true);
export const desk_tag_types_enabled = create_coupled_estore('desk_tag_types_enabled', {});

export const person_map = writable(new Map());
export const nfc_map = writable(new Map());
export const person_nfc_map = writable(new Map());

//rm
export const member_year_person_map = writable(new Map());
export const member_person_map = writable(new Map());

export const gate_in_map = writable(new Map());
export const gate_out_map = writable(new Map());

export const tag_type_map = writable(new Map());
export const person_tag_map = writable(new Map());
export const tag_map = writable(new Map());
export const desk_nfc_auto_tags = writable({});

export const reg_map = writable(new Map());
export const person_last_reg_ts_map = writable(new Map());
export const fresh_reg_ts_map = writable(new Map());

export const desk_selected_person_id = writable();
export const desk_selected_nfc_id = writable();