import { writable, readable } from 'svelte/store';

export const person = writable();
export const person_selected_by = writable();
export const nfc_uid = writable();
export const eid = writable();
export const gate_keeper = writable();
