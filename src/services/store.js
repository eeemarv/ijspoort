import { writable } from 'svelte/store';

export const person = writable();
export const person_nfc_list = writable([]);
export const nfc_uid = writable();
export const nfc_auto_reg = writable(true);
export const eid = writable();
export const gate_keeper = writable();
export const sync_monitor = writable('paused');
