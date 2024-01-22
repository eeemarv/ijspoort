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
import { ev_db_init } from '../services/events';
import { person_put_design } from '../db_design/person_design';
import { reg_put_design } from '../db_design/reg_design';
import { person_build_idx_by_simular } from '../db_idx/person_idx';
import { person_build_idx_by_text } from '../db_idx/person_idx';
import { reg_build_idx_by_person_id } from '../db_idx/reg_idx';
import { nfc_map_build } from '../db_map/nfc_map';
import { nfc_map_listen_changes } from '../db_map/nfc_map';
import { person_map_build } from '../db_map/person_map';
import { person_map_listen_changes } from '../db_map/person_map';
import { reg_map_build } from '../db_map/reg_map';
import { reg_map_cleanup } from '../db_map/reg_map';
import { reg_map_listen_changes } from '../db_map/reg_map';
import { gate_map_build } from '../db_map/gate_map';
import { gate_map_cleanup } from '../db_map/gate_map';
import { gate_map_listen_changes } from '../db_map/gate_map';
import { tag_map_build, tag_map_listen_changes, tag_type_map_build } from '../db_map/tag_map';
import { db_probe_connection, gate_sync } from './db_sync';
import { nfc_sync } from './db_sync';
import { person_sync } from './db_sync';
import { reg_sync } from './db_sync';
import { tag_sync } from './db_sync';

const dispatch_step = async (step, name) => {
  ev_db_init.dispatchEvent(new CustomEvent('step', {
    detail: {
      step: step, 
      name: name
    }
  })); 
  console.log('..' + step + '..' + name);
};

const replicate_options = {
  batch_size: 100,
  batch_limit: 1,
  checkpoint: false,
  filter: (doc) => {
    return !doc._id.startsWith('_design');
  }
};

const db_init = async (trig) => {

  if (trig.hasOwnProperty('ignore_network')){
    for (let i = 1; i < 16; i++){
      await dispatch_step(i, 'skip step, ignore network');      
    }
  } else {
    await db_remote_reg.info();
    await dispatch_step(1, 'reg.remote.info');
    await db_remote_nfc.info();
    await dispatch_step(2, 'nfc.remote.info'); 
    await db_remote_person.info();
    await dispatch_step(3, 'person.remote.info');
    await db_remote_gate.info();
    await dispatch_step(4, 'gate.remote.info');  
    await db_remote_tag.info();
    await dispatch_step(5, 'tag.remote.info');

    await db_nfc.replicate.from(db_remote_nfc, replicate_options);
    await dispatch_step(6, 'nfc.replicate.in');
    await db_nfc.replicate.to(db_remote_nfc, replicate_options);
    await dispatch_step(7, 'nfc.replicate.out');  
    await db_person.replicate.from(db_remote_person, replicate_options);
    await dispatch_step(8, 'person.replicate.in');
    await db_person.replicate.to(db_remote_person, replicate_options);
    await dispatch_step(9, 'person.replicate.out');
    await db_reg.replicate.from(db_remote_reg, replicate_options);
    await dispatch_step(10, 'reg.replicate.in');
    await db_reg.replicate.to(db_remote_reg, replicate_options);
    await dispatch_step(11, 'reg.replicate.out');
    await db_gate.replicate.from(db_remote_gate, replicate_options);
    await dispatch_step(12, 'gate.replicate.in');
    await db_gate.replicate.to(db_remote_gate, replicate_options);
    await dispatch_step(13, 'gate.replicate.out');
    await db_tag.replicate.from(db_remote_tag, replicate_options);
    await dispatch_step(14, 'tag.replicate.in');
    await db_tag.replicate.to(db_remote_tag, replicate_options);
    await dispatch_step(15, 'tag.replicate.out');
  }

  if (env.GATE === '1'){
    for (let j = 16; j < 21; j++){
      await dispatch_step(16, 'skip step in gate modus');      
    }
  } else {
    await person_put_design();
    await dispatch_step(16, 'person.put.design');
    await reg_put_design();
    await dispatch_step(17, 'reg.put.design');
    await person_build_idx_by_text();
    await dispatch_step(18, 'person.build_idx.by_text');
    await person_build_idx_by_simular();
    await dispatch_step(19, 'person.build_idx.by_simular');
    await reg_build_idx_by_person_id();
    await dispatch_step(20, 'reg.build_idx.by_person_id');
  }

  await nfc_map_build();
  await dispatch_step(21, 'nfc.map.build');
  nfc_map_listen_changes();
  await dispatch_step(22, 'nfc.map.listen_changes');

  await person_map_build();
  await dispatch_step(23, 'person.map.build');
  person_map_listen_changes();
  await dispatch_step(24, 'person.map.listen_changes');

  await reg_map_build();
  await dispatch_step(25, 'reg.map.build');
  reg_map_listen_changes();
  await dispatch_step(26, 'reg.map.listen_changes');
  reg_map_cleanup();
  await dispatch_step(27, 'reg.map.cleanup');

  await gate_map_build();
  await dispatch_step(28, 'gate.map.build');
  gate_map_listen_changes();
  await dispatch_step(29, 'gate.map.listen_changes');
  gate_map_cleanup();
  await dispatch_step(30, 'gate.map.cleanup');

  await tag_type_map_build();
  await dispatch_step(31, 'tag_type.map.build');
  await tag_map_build();
  await dispatch_step(32, 'tag.map.build');
  tag_map_listen_changes();
  await dispatch_step(33, 'tag.map.listen_changes');

  nfc_sync();
  await dispatch_step(34, 'nfc.sync');
  person_sync();
  await dispatch_step(35, 'person.sync');
  reg_sync();
  await dispatch_step(36, 'reg.sync');
  gate_sync();
  await dispatch_step(37, 'gate.sync');
  tag_sync();
  await dispatch_step(38, 'tag.sync');
  db_probe_connection();
  await dispatch_step(39, 'db_probe_connection');

  await dispatch_step(100, 'end');
}

export { db_init };
