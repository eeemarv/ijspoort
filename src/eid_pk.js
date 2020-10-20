import pkcs11js from 'pkcs11js';

export default class EidPk {

    static pkcs11 = new pkcs11js.PKCS11();

    static read(){
        try {
            EidPk.pkcs11.load('libbeidpkcs11.so.0');
            EidPk.pkcs11.C_Initialize();

            // Getting info about PKCS11 Module
            let module_info = EidPk.pkcs11.C_GetInfo();
            console.log('MODULE INFO');
            console.log(module_info);

            // Getting list of slots
            let slots = EidPk.pkcs11.C_GetSlotList(true);

            console.log('SLOTS');
            console.log(slots);
            let slot = slots[0];

            // Getting info about slot
            let slot_info = EidPk.pkcs11.C_GetSlotInfo(slot);

            console.log('SLOT_INFO');
            console.log(slot_info);

            // Getting info about token
            let token_info = EidPk.pkcs11.C_GetTokenInfo(slot);
            console.log('TOKEN_INFO');
            console.log(token_info);

            // Getting info about Mechanism
            let mechs = EidPk.pkcs11.C_GetMechanismList(slot);
            let mech_info = EidPk.pkcs11.C_GetMechanismInfo(slot, mechs[0]);
            console.log('MECH_INFO');
            console.log(mech_info);

            let session = EidPk.pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);

            // Getting info about Session
            let info = EidPk.pkcs11.C_GetSessionInfo(session);
            console.log('Session info');
            console.log(info);

            EidPk.pkcs11.C_FindObjectsInit(session, [{ type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_DATA }]);
            let hObject = EidPk.pkcs11.C_FindObjects(session);
            console.log('ATTRS');
            while (hObject) {

                let attrs = EidPk.pkcs11.C_GetAttributeValue(session, hObject, [
                    { type: pkcs11js.CKA_LABEL },
                    { type: pkcs11js.CKA_VALUE }
                ]);


                console.log(attrs[0].value.toString() + ':: ' + attrs[1].value.toString());

                hObject = EidPk.pkcs11.C_FindObjects(session);
            }

            EidPk.pkcs11.close();

            EidPk.pkcs11.C_CloseSession(session);
        }
        catch(e){
            console.error(e);
        }
        finally {
            EidPk.pkcs11.C_Finalize();
        }
    }

    constructor (){

        this.chip_number = '';
        this.EidPk_number = '';
        this.national_number = '';
        this.birth_date = '';
        this.birth_location = '';
        this.first_names = '';
        this.name = '';
        this.initial = '';
        this.valid_from = '';
        this.valid_till = '';
        this.sex = '';
        this.nationality = '';
        this.street_and_number = '';
        this.postcode = '';
        this.municipality = '';
        this.delivering_municipality = '';

        // const this_eid = this;

        EidPk.read();
    }
}