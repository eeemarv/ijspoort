"use strict";

/**
 * Based on https://github.com/firsttris/mfrc522-rpi
 * to rewrite for use with ioctl()
 */

import { PICC_Command } from './picc_command';
import { PCD_Command } from './pcd_command';
import { PCD_Reg } from './pcd_reg';
import { PCD_RxGain } from './pcd_rx_gain';
import SoftSPI from 'rpi-softspi';
import rpio from 'rpio';

class MFRC522 {
  /**
   * Initialize MFRC522
   */
  constructor() {
    this.spi = new SoftSPI({
        clock: 23,
        mosi: 19,
        miso: 21,
        client: 24
      });
    this.spi.open();
    return this;
  }

  setResetPin(pin = 22) {
    if (!pin) {
      throw new Error(
        "Invalid parameter! reset pin parameter is invalid or not provided!"
      );
    }
    this.reset_pin = pin;
    // Hold RESET pin low for 50ms to hard reset the reader
    rpio.open(this.reset_pin, rpio.OUTPUT, rpio.LOW);
    setTimeout(function() {
      rpio.write(this.reset_pin, rpio.HIGH);
    }.bind(this), 50);
    return this;
  }

  /**
   * Initialize MFRC522
   */
  reset() {
    this.writeRegister(PCD_Reg.Command, PCD_Command.SoftReset); // reset chip
    this.writeRegister(PCD_Reg.TMode, 0x8d); // TAuto=1; timer starts automatically at the end of the transmission in all communication modes at all speeds
    this.writeRegister(PCD_Reg.TPrescaler, 0x3e); // TPreScaler = TModeReg[3..0]:TPrescalerReg, ie 0x0A9 = 169 => f_timer=40kHz, ie a timer period of 25μs.
    this.writeRegister(PCD_Reg.TReloadL, 30); // Reload timer with 0x3E8 = 1000, ie 25ms before timeout.
    this.writeRegister(PCD_Reg.TReloadH, 0);
    this.writeRegister(PCD_Reg.TxASK, 0x40); // Default 0x00. Force a 100 % ASK modulation independent of the ModGsPReg register setting
    this.writeRegister(PCD_Reg.Mode, 0x3d); // Default 0x3F. Set the preset value for the CRC coprocessor for the CalcCRC command to 0x6363 (ISO 14443-3 part 6.2.4)
    this.antennaOn(); // Enable the antenna driver pins TX1 and TX2 (they were disabled by the reset)
  }

  /**
   * Get the current MFRC522 Receiver Gain (RxGain[2:0]) value.
   * See 9.3.3.6 / table 98 in http://www.nxp.com/documents/data_sheet/MFRC522.pdf
   * NOTE: Return value scrubbed with 0x70 =01110000b as RCFfgReg may use reserved bits.
   *
   * @return  Value of the RxGain, scrubbed to the 3 bits used.
   */
  getAntennaGain () {
    return this.readRegister(RFC_Reg.RFCfg) & 0x70;
  }

  /**
   * Set the MFRC522 Receiver Gain (RxGain) to value specified by given mask.
   * See 9.3.3.6 / table 98 in http://www.nxp.com/documents/data_sheet/MFRC522.pdf
   * NOTE: Given mask is scrubbed with 0x70=01110000b as RCFfgReg may use reserved bits.
   */

  setAntennaGain (bitmask) {
    if (this.getAntennaGain() != bitmask) {						// only bother if there is a change
      this.clearRegisterBitMask(PCD_Reg.RFCfg, 0x70);		// clear needed to allow 000 pattern
      this.setRegisterBitMask(PCD_Reg.RFCfg, bitmask & 0x70);	// only set RxGain[2:0] bits
    }
  }

  setAntennaGainMax() {
    this.setAntennaGain(PCD_RxGain.max);
  }

  setAntennaGainAvg() {
    this.setAntennaGain(PCD_RxGain.avg);
  }

  setAntennaGainMin() {
    this.setAntennaGain(PCD_RxGain.min);
  }

  /**
   * Write a byte to MFRC522 chip.
   * datasheet section 8.1.2.
   *
   * @param {any} addr
   * @param {any} val
   */
  writeRegister(reg, val) {
    this.spi.write(Uint8Array.from([reg, val]));
  }

  /**
   * read a byte from register, datasheet section 8.1.2.
   *
   * @param { any } reg
   * @returns { any }
   */
  readRegister(reg) {
    return this.spi.transfer(Uint8Array.from([reg | 0x80, 0]))[1];
  }

  /**
   * Sets bitmask in register.
   *
   * @param {any} reg
   * @param {any} bitmask
   * @memberof MFRC522
   */
  setRegisterBitMask(reg, bitmask) {
    this.writeRegister(reg, this.readRegister(reg) | bitmask);
  }

  /**
   * Clears bitmask in register.
   *
   * @param {any} reg
   * @param {any} mask
   * @memberof MFRC522
   */
  clearRegisterBitMask(reg, bitmask) {
    this.writeRegister(reg, this.readRegister(reg) & ~bitmask);
  }

  /**
   * @memberof MFRC522
   */
  antennaOn() {
    if (~(this.readRegister(PCD_Reg.TxControl) & 0x03) != 0) {
      this.setRegisterBitMask(PCD_Reg.TxControl, 0x03);
    }
  }

  /**
   * @memberof MFRC522
   */
  antennaOff() {
    this.clearRegisterBitMask(PCD_Reg.TxControl, 0x03);
  }

  /**
   *
   * RC522 and ISO14443 card communication
   * @param {number} command - command - MF522 command word
   * @param {Array} byteAry - sent to the card through the RC522 data
   * @returns {{success: boolean, data: Array, size: number}}
   */
  toCard(command, byteAry) {
    let data = [];
    let size = 0;
    let success = false;
    let irqEn = 0x00;
    let waitIRq = 0x00;

    if (command === PCD_Command.MFAuthent) {
      irqEn = 0x12;
      waitIRq = 0x10;
    }

    if (command === PCD_Command.Transceive) {
      irqEn = 0x77;
      waitIRq = 0x30;
    }

    this.writeRegister(PCD_Reg.ComIEn, irqEn | 0x80); //Interrupt request is enabled
    this.clearRegisterBitMask(PCD_Reg.ComIrq, 0x80); //Clears all interrupt request bits
    this.setRegisterBitMask(PCD_Reg.FIFOLevel, 0x80); //FlushBuffer=1, FIFO initialization
    this.writeRegister(PCD_Reg.Command, PCD_Command.Idle); // Stop calculating CRC for new content in the FIFO.

    //Write data to the FIFO
    for (let i = 0; i < byteAry.length; i++) {
      this.writeRegister(PCD_Reg.FIFOData, byteAry[i]);
    }

    //Excuting command
    this.writeRegister(PCD_Reg.Command, command);
    if (command === PCD_Command.Transceive) {
      this.setRegisterBitMask(PCD_Reg.BitFraming, 0x80); //StartSend=1,transmission of data starts
    }

    //Wait for the received data to complete
    let i = 2000; //According to the clock frequency adjustment, operation M1 card maximum waiting time 25ms
    let n = 0;

    do {
      n = this.readRegister(PCD_Reg.ComIrq);
      i--;
    } while (i != 0 && !(n & 0x01) && !(n & waitIRq));

    this.clearRegisterBitMask(PCD_Reg.BitFraming, 0x80); //StartSend=0
    if (!i) {
      if ((this.readRegister(PCD_Reg.Error) & 0x1b) == 0x00) {
        //BufferOvfl Collerr CRCErr ProtecolErr
        success = true;
        if (n & irqEn & 0x01) {
          success = false;
        }
        if (command === PCD_Command.Transceive) {
          n = this.readRegister(PCD_Reg.FIFOLevel);
          let lastBits = this.readRegister(PCD_Reg.Control) & 0x07;
          if (lastBits) {
            size = (n - 1) * 8 + lastBits;
          } else {
            size = n * 8;
          }
          if (n == 0) {
            n = 1;
          }
          if (n > 16) {
            n = 16;
          }
          //Reads the data received in the FIFO
          for (let i = 0; i < n; i++) {
            data.push(this.readRegister(PCD_Reg.FIFOData));
          }
        }
      } else {
        success = false;
      }
    }
    return { success, data, size };
  }

  /**
   * Find card, read card type
   * TagType - Returns the card type
   * 0x4400 = Mifare_UltraLight
   * 0x0400 = Mifare_One (S50)
   * 0x0200 = Mifare_One (S70)
   * 0x0800 = Mifare_Pro (X)
   * 0x4403 = Mifare_DESFire
   *
   * @returns {{success: boolean, size: Number, data: Array}}
   */
  findCard() {
    this.writeRegister(PCD_Reg.BitFraming, 0x07);
    const resp = this.toCard(PCD_Command.Transceive, [PICC_Command.REQA]);
    if (resp.size != 0x10) {
      resp.success = false;
    }
    return { ...resp };
  }

  /**
   * @returns {{success: boolean, data: Array, size: Number, uid: string}}
   */
  getUid() {
		let uid = '';

    this.writeRegister(PCD_Reg.BitFraming, 0x00);
		const sel_1 = [PICC_Command.SEL_CL1, 0x20];
		const resp_1 = this.toCard(PCD_Command.Transceive, sel_1);

    if (resp_1.success) {
			let uid_check = 0;
			for (let i = 0; i < 4; i++) {
				uid_check = uid_check ^ resp_1.data[i];
				uid += resp_1.data[i].toString(16).padStart(2, '0');
			}
			if (uid_check !== resp_1.data[4]) {
        resp_1.success = false;
      }
    }

    if (!resp_1.success){
			return { ...resp_1, uid };
    }

		// select ACK1
		// replaces mfrc522.selectCard(resp1.data);

		const buff_1 = [PICC_Command.SEL_CL1, 0x70];

		for (let i = 0; i < 5; i++) {
			buff_1.push(resp_1.data[i]);
		}

		const buff_1_crc = buff_1.concat(this.calculateCRC(buff_1));
		const resp_a1 = this.toCard(PCD_Command.Transceive, buff_1_crc);

    console.log('resp ack 1: ', resp_a1);

		if (!resp_a1.success){
			console.log('MFRC522 error ACK1 false status');
			return { ...resp_a1, uid };
		}

    if (resp_1.data[0] !== 0x88){
      // 4 byte uid
      return { ...resp_1, uid };
    }

		uid = uid.slice(2);

    const sel_2 = [PICC_Command.SEL_CL2, 0x20];
    const resp_2 = this.toCard(PCD_Command.Transceive, sel_2);

    if (resp_2.success) {
      let uid_check = 0;
      for (let i = 0; i < 4; i++) {
        uid_check = uid_check ^ resp_2.data[i];
        uid += resp_2.data[i].toString(16).padStart(2, '0');
      }
      if (uid_check !== resp_2.data[4]) {
        resp_2.success = false;
      }
    }

    if (!resp_2.success){
      return { ...resp_2, uid };
    }

    // select ack 2

    const buff_2 = [PICC_Command.SEL_CL2, 0x70];

    for (let i = 0; i < 5; i++) {
      buff_2.push(resp_2.data[i]);
    }

    const buff_2_crc = buff_2.concat(this.calculateCRC(buff_2));
    const resp_a2 = this.toCard(PCD_Command.Transceive, buff_2_crc);
    console.log('resp ack 2:', resp_a2);

    return { ...resp_a2, uid };
  }

  /**
   * Use the CRC coprocessor in the MFRC522 to calculate a CRC
   *
   * @param {any} data
   * @returns {array}
   * @memberof MFRC522
   */
  calculateCRC(data) {
    this.clearRegisterBitMask(PCD_Reg.DivIrq, 0x04); // Clear the CRCIRq interrupt request bit
    this.setRegisterBitMask(PCD_Reg.FIFOLevel, 0x80); // FlushBuffer = 1, FIFO initialization
    //Write data to the FIFO
    for (let i = 0; i < data.length; i++) {
      this.writeRegister(PCD_Reg.FIFOData, data[i]);
    }
    this.writeRegister(PCD_Reg.Command, PCD_Command.CalcCRC);
    //Wait for the CRC calculation to complete
    let i = 0xff;
    let n;
    do {
      n = this.readRegister(PCD_Reg.DivIrq);
      i--;
    } while (i != 0 && !(n & 0x04)); //CRCIrq = 1
    //CRC calculation result
    return [
      this.readRegister(PCD_Reg.CRCResultL),
      this.readRegister(PCD_Reg.CRCResultH)
    ];
  }
}

export { MFRC522 };