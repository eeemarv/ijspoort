import { sub_gate_sound_ok_enabled } from './sub';
import { sub_gate_sound_error_enabled } from './sub';

let sound_ok = () => {};
let sound_error = () => {};

const sound_ok_el = new Audio('../audio/ok3.mp3');
const sound_error_el = new Audio('../audio/error2.mp3');

sound_ok_el.addEventListener('canplaythrough', (ev) => {
  sound_ok = () => {
    if (!sub_gate_sound_ok_enabled){
      return;
    }
    sound_ok_el.currentTime = 0;
    sound_ok_el.play();
  };
});

sound_error_el.addEventListener('canplaythrough', (ev) => {
  sound_error = () => {
    if (!sub_gate_sound_error_enabled){
      return;
    }
    sound_error_el.currentTime = 0;
    sound_error_el.play();
  };
});

export { sound_ok };
export { sound_error };