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

const create_gate_count = () => {
	const { subscribe, set, update } = writable(50);
	return {
		subscribe,
		inc: () => update(n => n + 1),
		dec: () => update(n => n - 1),
		reset: () => set(0),
    set: (n) => {
      n = n ? n : 0;
      n = n > 999 ? 999 : n;
      n = n < -99 ? -99 : n;
      set(n);
    }
	};
};

const create_temp_display_enabled = () => {
  const eStore = new EStore();
  let enabled = eStore.get('temp_display_enabled', false);
	const { subscribe, set } = writable(enabled);
	return {
		subscribe,
    set: (b) => {
      console.log('SET eStore temp_display_enabled');
      eStore.set('temp_display_enabled', b);
      set(b);
    }
	};
};


export const person = writable();
export const person_nfc_list = writable([]);
export const nfc_uid = writable();
export const nfc_auto_reg = writable(true);
export const sync_monitor = create_sync_monitor();
export const gate_count = create_gate_count();
export const gate_count_enabled = writable(false);
export const gate_nfc_enabled = writable(false);
export const cache_nfc_person = writable();
export const temp_display_enabled = create_temp_display_enabled();