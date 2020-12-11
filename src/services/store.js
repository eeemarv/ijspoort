import { writable } from 'svelte/store';

export const person = writable();
export const nfc_uid = writable();
export const eid = writable();
export const gate_keeper = writable();
export const db_sync_enabled = writable(false);
