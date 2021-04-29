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

const create_modals = () => {
    const { subscribe, update } = writable({});
    const set_prop = (id, name, value) => {
        update((n) => {
            n[id].props[name] = value;
            return {...n};
        });
    };
    return {
        subscribe,
        add: (id, component) => {
            update((n) => {
                n[id] = {
                    component: component,
                    props: {
                        open: false,
                        title: '',
                        message: '',
                        progress: 0
                    }
                };
                return {...n};
            });
        },
        open: (id) => {
            set_prop(id, 'open', true);
        },
        close: (id) => {
            set_prop(id, 'open', false);
        },
        close_after: (id, sec) => {
            setTimeout(() => {
                set_prop(id, 'open', false)
            }, sec);
        },
        progress: (id, value) => {
            set_prop(id, 'progress', value);
        },
        message: (id, message) => {
            set_prop(id, 'message', message);
        },
        title: (id, title) => {
            set_prop(id, 'title', title);
        }
    }
}

export const person = writable();
export const person_nfc_list = writable([]);
export const nfc_uid = writable();
export const nfc_auto_reg = writable(true);
export const sync_monitor = create_sync_monitor();
export const modals = create_modals();
export const gate_count = writable(32);
export const gate_count_max = writable(32);
export const gate_count_enabled = writable(false);
export const gate_nfc_enabled = writable(false);
