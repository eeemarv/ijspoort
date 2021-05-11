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
	const { subscribe, set, update } = writable(32);

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

export const person = writable();
export const person_nfc_list = writable([]);
export const nfc_uid = writable();
export const nfc_auto_reg = writable(true);
export const sync_monitor = create_sync_monitor();
export const gate_count = create_gate_count(32);
export const gate_count_enabled = writable(false);
export const gate_nfc_enabled = writable(false);
