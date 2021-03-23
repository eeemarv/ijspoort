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

const create_modal = () => {
    const id = {};
    const state = {
        id: id,
        open: false,
        title: '',
        size: 'md',
        color: 'default',
        message: '',
        popover: -1
    };
    const { subscribe } = writeable();
    return {
        toggle: (state) => {
            state.open = !state.open;
            return state;
        }
    }
}

export const person = writable();
export const person_nfc_list = writable([]);
export const nfc_uid = writable();
export const nfc_auto_reg = writable(true);
export const eid = writable();
export const sync_monitor = create_sync_monitor();
