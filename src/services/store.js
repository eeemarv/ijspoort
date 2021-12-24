const EStore = require('electron-store');
import { writable } from 'svelte/store';

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
export const temp_display_enabled = create_coupled_estore('temp_display_enabled', false);
export const assist_import_year = create_coupled_estore('assist_import_year', 2022, 2016, 2030);
export const focus_year = create_coupled_estore('focus_year', 2022, 2016, 2030);
export const gate_display_enabled = create_coupled_estore('gate_display_enabled', true);
export const tag_display_enabled = create_coupled_estore('tag_display_enabled', true);