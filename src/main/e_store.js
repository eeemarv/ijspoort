import EStore from 'electron-store';

const eStore = new EStore();

const e_store_get = (key, default_value) => {
  return eStore.get(key, default_value);
};

const e_store_set = (key, value) => {
  eStore.set(key, value);
};

export { e_store_get, e_store_set };