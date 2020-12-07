const { NFC, TAG_ISO_14443_3, KEY_TYPE_A, KEY_TYPE_B } = require('nfc-pcsc');
const crypto = require('crypto');
const EidReader = require('./eid_reader');

class PcscListen {
    constructor(win){
        this.win = win;
    }

    read(slot){

    }
};

module.exports = PcscListen;