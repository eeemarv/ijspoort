const env = window.require('electron').remote.process.env;
import { sub_nfc_map } from '../services/sub';
import { sub_desk_member_period_filter } from '../services/sub';
import { sub_person_tag_map } from '../services/sub';
import { sub_desk_nfc_auto_open_person_data_enabled } from '../services/sub';
import { sub_desk_nfc_auto_tags } from '../services/sub';
import { sub_desk_tag_types_enabled } from '../services/sub';
import { sub_tag_type_map } from '../services/sub';
import { ev_nfc_scan } from '../services/events';
import { tag_add_bulk } from '../db_put/tag_put';

const gate_modus = env.GATE === '1';

const listen_tag_nfc_auto = () => {
  if (gate_modus){
    return;
  }
  ev_nfc_scan.addEventListener('person_valid_member', (e) => {
    if (typeof sub_desk_member_period_filter !== 'string'){
      // should not happen
      console.log('-- ERR desk_member_period_filter is not a string');
      return;
    }
    if (!sub_desk_nfc_auto_open_person_data_enabled){
      console.log('-- open person data on nfc not enabled');
      return;
    }
    if (!Object.keys(sub_desk_tag_types_enabled).length){
      console.log('--no tag types enabled');
      return;
    }
    const nfc_id = e.detail.nfc_id;
    if (typeof nfc_id !== 'string'){
      console.log('--nfc_id not string');
      return;
    }
    if (!sub_nfc_map.has(nfc_id)){
      console.log('--nfc not found');
      return;
    }
    const person_id = sub_nfc_map.get(nfc_id).person_id;
    if (typeof person_id !== 'string'){
      console.log('-- no string person_id');
      return;
    }
    const tag_add_ary = [];
    for (const [type_id, tag_type] of sub_tag_type_map){
      if (typeof sub_desk_tag_types_enabled[type_id] !== 'boolean'){
        continue;
      }
      if (!sub_desk_tag_types_enabled[type_id]){
        continue;
      }
      if (typeof sub_desk_nfc_auto_tags[type_id] !== 'boolean'){
        continue;
      }
      if (!sub_desk_nfc_auto_tags[type_id]){
        continue;
      }
      if (tag_type.max_per_person < 1){
        continue;
      }
      if (!sub_person_tag_map.has(person_id)){
        console.log('-- tag add - a1 - ', tag_type);
        tag_add_ary.push(type_id);
        continue;
      }
      const p_map = sub_person_tag_map.get(person_id);
      if (!p_map.has(type_id)){
        console.log('-- tag add - a2 - ', tag_type);
        tag_add_ary.push(type_id);
        continue;
      }
      const t_map = p_map.get(type_id);
      if (!t_map.size){
        console.log('-- tag add - a3 - ', tag_type);
        tag_add_ary.push(type_id);
        continue;
      }
      if (t_map.size < tag_type.max_per_person){
        console.log('-- tag add - a4 - ', tag_type);
        tag_add_ary.push(type_id);
        continue;
      }
      console.log('-- tag not add - b1 (max reached)', tag_type);
    }
    if (!tag_add_ary.length){
      console.log('-- no tags to add');
      return;
    }
    console.log('-- tags to add ', tag_add_ary);
    tag_add_bulk(tag_add_ary, person_id);
  });
};

export { listen_tag_nfc_auto };