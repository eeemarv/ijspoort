import { ev_nfc_scan } from '../services/events';

let on = false;
let error = false;
let timeout_id = undefined;

const listen_nfc_device = () => {
  window.bridge.onDevNfcOn(() => {
    ev_nfc_scan.dispatchEvent(new Event('nfc_device_on'));
    on = true;
  });

  window.bridge.onDevNfcOff(() => {
    ev_nfc_scan.dispatchEvent(new Event('nfc_device_off'));
    on = false;
  });

  window.bridge.onDevNfcError(() => {
    ev_nfc_scan.dispatchEvent(new Event('nfc_device_error'));
    error = true;
    clearTimeout(timeout_id);
    timeout_id = setTimeout(() => {
      ev_nfc_scan.dispatchEvent(new Event('nfc_device_no_error'));
      error = false;
    }, 5000);
  });

  setInterval(() => {
    ev_nfc_scan.dispatchEvent(new Event(on ? 'nfc_device_on' : 'nfc_device_off'));
    ev_nfc_scan.dispatchEvent(new Event(error ? 'nfc_device_error' : 'nfc_device_no_error'));
  }, 5000);
};

export { listen_nfc_device };
