class IjsEvents extends EventTarget{};

const e_db_init = new IjsEvents();
const e_db_sync = new IjsEvents();

export {
  e_db_init,
  e_db_sync
};