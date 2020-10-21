import pkcs11js from 'pkcs11js';

export default class EidReader {
    static pkcs11 = new pkcs11js.PKCS11();

    static eid_fields = {
        card_number: 'utf8',
        validity_begin_date: 'utf8',
        validity_end_date: 'utf8',
        national_number: 'utf8',
        surname: 'utf8',
        firstnames: 'utf8',
        first_letter_of_third_given_name: 'utf8',
        nationality: 'utf8',
        location_of_birth: 'utf8',
        date_of_birth: 'utf8',
        gender: 'utf8',
        address_street_and_number: 'utf8',
        address_zip: 'utf8',
        address_municipality: 'utf8',
        photo_file: 'base64'
    };

    static load_libbeid(){
        try {
            EidReader.pkcs11.load('libbeidpkcs11.so.0');
            EidReader.pkcs11.C_Initialize();
        } catch(e){
            console.error(e);
        }
    }

    constructor(){
        EidReader.load_libbeid();
    }

    get_slot(){
        try {
            let slots = EidReader.pkcs11.C_GetSlotList(true);
            return slots.find((el, index) => {
                let slot_info = EidReader.pkcs11.C_GetSlotInfo(el);
                console.log('-- slot info --', slot_info);
                if (slot_info.slotDescription.toLowerCase().indexOf('acr122') !== -1){
                    return false;
                }
                let token_info = EidReader.pkcs11.C_GetTokenInfo(el);
                console.log('-- token info --', token_info);
                if (!token_info.label.toLowerCase().startsWith('belpic')){
                    return false;
                }
                if (!token_info.model.toLowerCase().startsWith('belgium eid')){
                    return false;
                }
                return true;
            });
        } catch(e){
            console.error(e);
        }
    }

    read(eid_slot){
        console.log('eid_slot', eid_slot);
        let eid = {};
        try {
            let session = EidReader.pkcs11.C_OpenSession(eid_slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
            EidReader.pkcs11.C_FindObjectsInit(session, [{ type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_DATA }]);
            let hObject = EidReader.pkcs11.C_FindObjects(session);
            while (hObject) {
                let attrs = EidReader.pkcs11.C_GetAttributeValue(session, hObject, [
                    { type: pkcs11js.CKA_LABEL },
                    { type: pkcs11js.CKA_VALUE }
                ]);
                let key = attrs[0].value.toString('latin1').toLowerCase();
                if (key in EidReader.eid_fields){
                    let enc = EidReader.eid_fields[key];
                    eid[key] = attrs[1].value.toString(enc);
                }
                hObject = EidReader.pkcs11.C_FindObjects(session);
            }
            EidReader.pkcs11.C_CloseSession(session);
            return eid;
        } catch(e){
            console.error(e);
        }
    }
};