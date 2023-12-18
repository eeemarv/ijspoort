import { person_map } from './store';

let sub_person_map = new Map();

person_map.subscribe((m) => {
  sub_person_map = m;
});

export { sub_person_map };