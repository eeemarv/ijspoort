const EStore = require('electron-store');
import { readable, writable } from 'svelte/store';

const create_sync_monitor = () => {
  const { subscribe, set } = writable('paused');
  return {
    subscribe,
    set_active: () => {
      set('active');
      setTimeout(() => {
        set('paused');
      }, 1000);
    },
    set_error: () => {
      set('error');
      setTimeout(() => {
        set('paused');
      }, 3000);
    }
  }
};

const create_coupled_estore = (key, default_value, min_value, max_value) => {
  const eStore = new EStore();
  let val = eStore.get(key, default_value);
	const { subscribe, set, update } = writable(val);
  const store = (n) => {
    if (max_value){
      n = n > max_value ? max_value : n;
    }
    if (min_value){
      n = n < min_value ? min_value : n;
    }
    eStore.set(key, n);
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
    }
	};
};

export const person = writable();

export const person_nfc_list = writable([]);
export const nfc_uid = writable();

export const sync_monitor = create_sync_monitor();
export const gate_count = create_coupled_estore('gate_count', 50, -99, 999);
export const gate_count_enabled = writable(false);
export const gate_nfc_enabled = writable(false);
export const gate_nfc_open_time = create_coupled_estore('gate_nfc_open_time', 12, 6, 20);
export const nfc_reset_enabled = create_coupled_estore('nfc_reset_enabled', false);
export const nfc_read_test_enabled = create_coupled_estore('nfc_read_test_enabled', false);
export const temp_display_enabled = create_coupled_estore('temp_display_enabled', false);
export const assist_import_year = create_coupled_estore('assist_import_year', 2022, 2016, 2030);
export const focus_year = create_coupled_estore('focus_year', 2022, 2016, 2030);
export const focus_year_filter_enabled = create_coupled_estore('focus_year_filter_enabled', true);

export const gate_display_enabled = create_coupled_estore('gate_display_enabled', true);

export const beep_enabled = create_coupled_estore('beep_enabled', true);
export const sound_ok_enabled = create_coupled_estore('sound_ok_enabled', false);
export const sound_error_enabled = create_coupled_estore('sound_error_enabled', false);

export const person_nfc_auto_enabled = create_coupled_estore('person_nfc_auto_enabled', true);
export const reg_nfc_auto_enabled = create_coupled_estore('reg_nfc_auto_enabled', false);

export const reg_block_time = create_coupled_estore('reg_block_time', 1800000);


export const tag_display_enabled = create_coupled_estore('tag_display_enabled', true);
export const tag_types_enabled = create_coupled_estore('tag_types_enabled', {});
export const tag_nfc_auto_enabled = create_coupled_estore('tag_nfc_auto_enabled', false);

export const tag_types = writable({});
export const tag_count_by_type = writable({});
export const tag_total_count = writable(0);
export const tag_type_count = writable(0);
export const tag_type_enabled_sorted_id_ary = writable([]);
export const tag_type_sorted_id_ary = writable([]);
export const tag_person_sorted_ary = writable([]);
export const tag_person_count_by_type = writable({});

export const person_map = writable(new Map());
export const nfc_map = writable(new Map());
export const person_nfc_map = writable(new Map());
export const person_member_year_count_map = writable(new Map());

export const gate_map = writable(new Map());

export const tag_type_table = writable({});
export const person_tag_table = writable({});
export const tag_count_table = writable({});

export const reg_map = writable(new Map());
export const person_last_reg_ts_map = writable(new Map());

export const selected_person_id = writable();
export const selected_nfc_id = writable();