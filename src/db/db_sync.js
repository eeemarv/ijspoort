import { e_db_sync } from '../services/events';
import { db_nfc } from './db';
import { db_person } from './db';
import { db_reg } from './db';
import { db_gate } from './db';
import { db_tag } from './db';
import { db_remote_nfc } from './db';
import { db_remote_person } from './db';
import { db_remote_reg } from './db';
import { db_remote_gate } from './db';
import { db_remote_tag } from './db';

const sync_options = {
  live: true,
  retry: true,
  batch_size: 100,
  batch_limit: 1,
  checkpoint: false,
  filter: (doc) => {
    return !doc._id.startsWith('_design');
  }
};

const dispatch_sync = (source, type, err_msg = undefined) => {
  const detail = {
    source: source,
    type: type
  };
  if (typeof err_msg !== 'undefined'){
    detail.err = err;
  }
  e_db_sync.dispatchEvent(new CustomEvent('sync', {
    detail: detail
  }));
  console.log('__sync__' + source + '.' + type);
  if (typeof err_msg !== 'undefined'){
    console.log(err_msg);
  }
};

const reg_sync = () => {
  db_reg.sync(db_remote_reg, sync_options)
  .on('change', () => {
    dispatch_sync('reg', 'change');
  }).on('paused', () => {
    dispatch_sync('reg', 'paused');  
  }).on('active', () => {
    dispatch_sync('reg', 'active');
  }).on('denied', (err) => {
    dispatch_sync('reg', 'denied', err);
  }).on('complete', () => {
    dispatch_sync('reg', 'complete');
  }).on('error', (err) => {
    dispatch_sync('reg', 'error', err);
  });
};

const nfc_sync = () => {
  db_nfc.sync(db_remote_nfc, sync_options)
  .on('change', () => {
    dispatch_sync('nfc', 'change');
  }).on('paused', () => {
    dispatch_sync('nfc', 'paused');
  }).on('active', () => {
    dispatch_sync('nfc', 'active');
  }).on('denied', (err) => {
    dispatch_sync('nfc', 'denied', err);
  }).on('complete', () => {
    dispatch_sync('nfc', 'complete');
  }).on('error', (err) => {
    dispatch_sync('nfc', 'error', err);
  });
};

const person_sync = () => {
  db_person.sync(db_remote_person, sync_options)
  .on('change', () => {
    dispatch_sync('person', 'change');
  }).on('paused', () => {
    dispatch_sync('person', 'paused');
  }).on('active', () => {
    dispatch_sync('person', 'active');
  }).on('denied', (err) => {
    dispatch_sync('person', 'denied', err);
  }).on('complete', () => {
    dispatch_sync('person', 'complete');
  }).on('error', (err) => {
    dispatch_sync('person', 'error', err);
  });
};

const gate_sync = () => {
  db_gate.sync(db_remote_gate, sync_options)
  .on('change', () => {
    dispatch_sync('gate', 'change');
  }).on('paused', () => {
    dispatch_sync('gate', 'paused');
  }).on('active', () => {
    dispatch_sync('gate', 'active');
  }).on('denied', (err) => {
    dispatch_sync('gate', 'denied', err);
  }).on('complete', () => {
    dispatch_sync('gate', 'complete');
  }).on('error', (err) => {
    dispatch_sync('gate', 'error', err);
  });
};

const tag_sync = () => {
  db_tag.sync(db_remote_tag, sync_options)
  .on('change', () => {
    dispatch_sync('tag', 'change');
  }).on('paused', () => {
    dispatch_sync('tag', 'paused');
  }).on('active', () => {
    dispatch_sync('tag', 'active');
  }).on('denied', (err) => {
    dispatch_sync('tag', 'denied', err);
  }).on('complete', () => {
    dispatch_sync('tag', 'complete');
  }).on('error', (err) => {
    dispatch_sync('tag', 'error', err);
  });
};

export { reg_sync };
export { nfc_sync };
export { person_sync };
export { gate_sync };
export { tag_sync };
