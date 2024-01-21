const env = window.require('electron').remote.process.env;
import { db_remote_reg } from './db';
import { db_remote_nfc } from './db';
import { db_remote_person } from './db';
import { db_remote_gate } from './db';
import { db_remote_tag } from './db';
import { db_reg } from './db';
import { db_nfc } from './db';
import { db_person } from './db';
import { db_gate } from './db';
import { db_tag } from './db';
import { e_db_init } from './events';

const dispatch_step = (step, name) => {
  e_db_init.dispatchEvent(new CustomEvent('step', {
    detail: {
      step: step, 
      name: name
    }
  })); 
  console.log('..' + step + '..' + name);
};

const db_replicate = db_remote_reg.info().then(() => {
  dispatch_step(1, 'reg.remote.info');
  return db_remote_nfc.info();
}).then(() => {
  dispatch_step(2, 'nfc.remote.info'); 
  return db_remote_person.info();
}).then(() => {
  dispatch_step(3, 'person.person.info');
  return db_remote_gate.info();
}).then(() => {
  dispatch_step(4, 'gate.remote.info');
  return db_remote_tag.info();
}).then(() => {
  dispatch_step(5, 'tag.remote.info');
  return db_nfc.replicate.from(db_remote_nfc);
}).then(() => {
  dispatch_step(6, 'nfc.replicate.in');
  return db_nfc.replicate.to(db_remote_nfc);
}).then(() => {
  dispatch_step(7, 'nfc.replicate.out');  
  return db_person.replicate.from(db_remote_person);
}).then(() => {
  dispatch_step(8, 'person.replicate.in');
  return db_person.replicate.to(db_remote_person);
}).then(() => {
  dispatch_step(9, 'person.replicate.out');
  return db_reg.replicate.from(db_remote_reg);
}).then(() => {
  dispatch_step(10, 'reg.replicate.in'); 
  return db_reg.replicate.to(db_remote_reg);
}).then(() => {
  dispatch_step(11, 'reg.replicate.out');
  return db_gate.replicate.from(db_remote_gate);
}).then(() => {
  dispatch_step(12, 'gate.replicate.in');
  return db_gate.replicate.to(db_remote_gate);
}).then(() => {
  dispatch_step(13, 'gate.replicate.out');
  return db_tag.replicate.from(db_remote_tag);
}).then(() => {
  dispatch_step(14, 'tag.replicate.in');
  return db_tag.replicate.to(db_remote_tag);
}).then(() => {
  dispatch_step(15, 'tag.replicate.out');
}).catch((err) => {
  console.log(err);
});

export {
  db_replicate
};
