import { nfc_uid_to_id } from './nfc_id';
import { ev_nfc_scan_dispatch } from './nfc_scan';

const nfc_test_transport_key = async ({nfc_uid}) => {
  const d1 = await window.bridge.invokeNfcTestTransport({nfc_uid});
  const nfc_id = nfc_uid_to_id(nfc_uid);
  if (typeof d1.error === 'undefined'){
    ev_nfc_scan_dispatch('nfc_transport_key_ok', {nfc_id});
    return;
  }
  console.log('-nfc tranport key fail: ', d1);
  ev_nfc_scan_dispatch('nfc_transport_key_fail', {nfc_id});
  console.log(nfc_uid + ' test B key');
  const d2 = await window.bridge.invokeNfcTestB({nfc_uid});
  if (typeof d2.error === 'undefined'){
    console.log('nfc.test_b_key.ok', nfc_uid);
    ev_nfc_scan_dispatch('nfc_writable', {nfc_id});
    return;
  }
  console.log('-nfc b key fail: ', d2);
  ev_nfc_scan_dispatch('nfc_not_writable', {nfc_id});
};

export { nfc_test_transport_key };