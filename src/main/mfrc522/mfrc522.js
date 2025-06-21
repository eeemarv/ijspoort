// @ts-check
"use strict";

import SPIDevice from '@eeemarv/io-spi';
import { setTimeout as waitMs } from 'timers/promises';
import { PCD_Cmd } from './pcd_command.js';
import { PCD_Reg } from './pcd_reg.js';
import { PICC_Cmd } from './picc_command.js';

class MFRC522Scan {
  /** @type {SPIDevice} */
  #spi;
  /** @type {boolean} */
  #busy = false;
  /** @type {boolean} */
  #scanStarted = false;
  /** @type {number} */
  #speedTimer = 0;
  /** @type {(uid: number[]) => void} */
  #onTagCallback;
  /** @type {(speedHz: number) => void} */
  #onSpeedCallback;
  /** @type {() => void} */
  #onDeviceUpCallback;
  /** @type {() => void} */
  #onDeviceDownCallback;

  constructor() {
    this.#spi = new SPIDevice('/dev/spidev0.0', {
      max_speed_hz: 8_000_000
    });
  }

  /**
   * @param {number} test
   * @returns {void}
   */
  #testByte = (test) => {
    if (!Number.isInteger(test)){
      throw new TypeError(`Error, not an integer ${JSON.stringify(test)}`);
    }
    if (test > 255){
      throw new RangeError(`Error out of range: ${JSON.stringify(test)}`);
    }
    if (test < 0){
      throw new RangeError(`Error out of range: ${JSON.stringify(test)}`);
    }
  };

  /**
   * @param {number} addr
   * @returns {number}
   */
  #getReadAddr = (addr) => {
    return ((addr << 1) & 0x7e) | 0x80;
  };

  /**
   * @param {number} addr
   * @returns {number}
   */
  #getWriteAddr = (addr) => {
    return (addr << 1) & 0x7e;
  };

  /**
   * Read from the MFRC522
   * @param {number[]} addrAry registers to read
   * @returns {Promise<number[]>} values of the registers
   */
  #read = async (addrAry) => {
    if (!Array.isArray(addrAry)){
      throw new TypeError(`addrAry is not an array: ${JSON.stringify(addrAry)}`);
    }
    if (!addrAry.length){
      throw new RangeError('read addrAry is empty');
    }
    for (const addr of addrAry){
      this.#testByte(addr);
    }
    const [rxBuf] = await this.#spi.transfer([
      Buffer.from([
        ...addrAry.map((addr) => this.#getReadAddr(addr)),
        0x00
      ])
    ]);
    return [...rxBuf].slice(1); // Skip 1 byte
  };

  /**
   * Write to the MFRC522
   * The first element in each nested array is
   * the register address to write to,
   * the following byte(s) the data
   * @param {number[][]} writeAry
   * @returns {Promise<void>}
   */
  #write = async (writeAry) => {
    if (!Array.isArray(writeAry)){
      throw new TypeError(`writeAry is not an array: ${JSON.stringify(writeAry)}`);
    }
    if (!writeAry.length){
      throw new RangeError('writeAry is empty');
    }
    for (const subAry of writeAry){
      if (!Array.isArray(subAry)){
        throw new TypeError(`write subAry is not an array: ${JSON.stringify(subAry)}`)
      }
      if (!subAry.length){
        throw new RangeError('write subAry is empty');
      }
      if (subAry.length < 2){
        throw new RangeError(`write subAry needs a least two elements, an address and register: ${JSON.stringify(subAry)}`);
      }
      for (const test of subAry){
        this.#testByte(test);
      }
    }
    const lastWr = writeAry.pop();
    await this.#spi.transfer([
      ...writeAry.map((wr) => { return {
        tx_buf: Buffer.from([this.#getWriteAddr(wr[0]), ...wr.slice(1)]),
        cs_change: 1
      }}),
      // @ts-ignore
      Buffer.from([this.#getWriteAddr(lastWr[0]), ...lastWr.slice(1)])
    ]);
  };

  /**
   * Set bits in a register of the MFRC522
   * @param {number} addr
   * @param {number} bitMask
   * @returns {Promise<void>}
   */
  #setBitMask = async (addr, bitMask) => {
    if (!bitMask){
      return;
    }
    const [value] = await this.#read([addr]);
    const newValue = value | bitMask;
    if (value == newValue){
      return;
    }
    await this.#write([[addr, newValue]]);
  };

  /**
   * Clear bits in a register of the MFRC522
   * @param {number} addr
   * @param {number} bitMask
   * @returns {Promise<void>}
   */
  #clearBitMask = async (addr, bitMask) => {
    if (!bitMask){
      return;
    }
    const [value] = await this.#read([addr]);
    const newValue = value & ~bitMask;
    if (value == newValue){
      return;
    }
    await this.#write([[addr, newValue]]);
  };

  /**
   * Soft Reset the MFRC522
   * @returns {Promise<void>}
   */
  #reset = async () => {
    await this.#write([[PCD_Reg.Command, PCD_Cmd.SoftReset]]);
    await waitMs(50);
  };

  /**
   * Init the MFRC522 for transmission
   * @returns {Promise<void>}
   */
  #initRegs = async () => {
    // antenna on
    await this.#setBitMask(PCD_Reg.TxControl, 0x03);

    await this.#write([
      // 106 kbit/s type A (default)
      [PCD_Reg.TxMode, 0x00],
      [PCD_Reg.RxMode, 0x00],
      // reset modwidth
      [PCD_Reg.ModWidth, 0x26],
      // Timer: TAuto=1; timer starts automatically at transmission end
      // TAuto=1, timer prescaler
      [PCD_Reg.TMode, 0x8d],
      // 40kHz
      [PCD_Reg.TPrescaler, 0x3e],
      // 25ms before timeout
      [PCD_Reg.TReloadH, 0x00],
      [PCD_Reg.TReloadL, 0x1e],
      // force 100% ASK modulation
      [PCD_Reg.TxASK, 0x40],
      // preset 0x6363 fpr CRC
      [PCD_Reg.Mode, 0x3d],
    ]);
  };

  /**
   * Communicate with a tag through the MFRC522
   * @param {number[]} dataAry - sent to the card
   * @returns {Promise<{success: boolean, data: number[], bitSize: number}>}
   */
  #transeive = async (dataAry) => {

    const [comIrq1, fifoLevel1, bitFraming1] = await this.#read([
      PCD_Reg.ComIrq,
      PCD_Reg.FIFOLevel,
      PCD_Reg.BitFraming,
    ]);

    await this.#write([
      // interrupt request enabled
      [PCD_Reg.ComIEn, 0xf7],
      // clear all interupt requests
      [PCD_Reg.ComIrq, comIrq1 & 0x7f],
      // flush FIFO
      [PCD_Reg.FIFOLevel, fifoLevel1 | 0x80],
      // Stop calculating CRC for new data in the FIFO
      [PCD_Reg.Command, PCD_Cmd.Idle],
      // data to FIFO
      [PCD_Reg.FIFOData, ...dataAry],
      // Transeive
      [PCD_Reg.Command, PCD_Cmd.Transceive],
      // start send
      [PCD_Reg.BitFraming, bitFraming1 | 0x80],
    ]);

    //Wait for the received data to complete
    let irq = 0;
    let timeout = true;

    for (let i = 0; i < 8; i++){
      await waitMs(3);
      [irq] = await this.#read([PCD_Reg.ComIrq]);
      if (!(irq & 0x01)){
        timeout = false;
        break;
      }
      if (!(irq & 0x30)){ // WaitIRq
        timeout = false;
        break;
      }
    }

    // start send = 0
    await this.#clearBitMask(PCD_Reg.BitFraming, 0x80);

    if (timeout){
      return {success: false, data: [], bitSize: 0};
    }

    const [
      error,
      fifoLevel,
      control
    ] = await this.#read([
      PCD_Reg.Error,
      PCD_Reg.FIFOLevel,
      PCD_Reg.Control
    ]);

    if (error & 0x1b){
      return {success: false, data: [], bitSize: 0};
    }

    let success = true;
    let bitSize;

    if (irq & 0x01) {
      success = false;
    }

    let byteSize = fifoLevel;
    let lastBits = control & 0x07;

    if (lastBits) {
      bitSize = (byteSize - 1) * 8 + lastBits;
    } else {
      bitSize = byteSize * 8;
    }

    if (byteSize == 0) {
      byteSize = 1;
    }

    if (byteSize > 16) {
      byteSize = 16;
    }

    // Read data from FIFO
    const data = await this.#read(new Array(byteSize).fill(PCD_Reg.FIFOData));

    return { success, data, bitSize };
  };

  /**
   * Detect if a tag is present in the antenna field
   * @returns {Promise<boolean>} card detected
   */
  #detect = async () => {
    await this.#write([[PCD_Reg.BitFraming, 0x07]]);
    const {success, data, bitSize} = await this.#transeive([PICC_Cmd.REQA]);

    if (!success){
      return false;;
    }
    if (bitSize != 0x10) {
      return false;
    }
    if (data.length != 2){
      return false;
    }

    return true;
  };

  /**
   * Calculate a CRC on the co-processor of the MFRC522
   * @param {number[]} dataAry
   * @returns {Promise<void|number[]>}
   */
  #calcCRC = async (dataAry) => {
    // Clear the CRCIRq interrupt request bit
    await this.#clearBitMask(PCD_Reg.DivIrq, 0x04);
    // Flush FIFO
    await this.#setBitMask(PCD_Reg.FIFOLevel, 0x80);
    // data to FIFO and execute CalcCRC
    await this.#write([
      [PCD_Reg.FIFOData, ...dataAry],
      [PCD_Reg.Command, PCD_Cmd.CalcCRC],
    ]);

    for (let i = 0; i < 1000; i++){
      const [irq] = await this.#read([PCD_Reg.DivIrq]);
      if (irq & 0x04){
        return await this.#read([
          PCD_Reg.CRCResultL, PCD_Reg.CRCResultH,
        ]);
      }
    }
  };

  /**
   * Select anticollision for cascade leveland
   * get SAK (select acknowledge) from a tag
   * @param {number} level
   * @returns {Promise<void|number[]>}
   */
  #cascade = async (level) => {
    if (![1, 2, 3].includes(level)){
      throw new RangeError(`level must be 1, 2 or 3, current: ${level}`);
    }
    const cmd = [
      PICC_Cmd.SEL_CL1,
      PICC_Cmd.SEL_CL2,
      PICC_Cmd.SEL_CL3,
    ][level - 1];
    const cas1 = [cmd, 0x20];
    for (let i = 0; i < 5; i++){
      if (!i){
        await waitMs(2);
      }
      await this.#write([[PCD_Reg.BitFraming, 0x00]]);
      const {success, data, bitSize} = await this.#transeive(cas1);
      if (!success){
        continue;
      }
      if (bitSize != 40){
        continue;
      }
      // Check BCC (data[4])
      if ((data[0] ^ data[1] ^ data[2] ^ data[3]) != data[4]){
        continue;
      }
      return data;
    }
  };

  /**
   * Return a 4, 7 or 10 byte UID
   * from a tag in the antenna field
   * @returns {Promise<void|number[]>}
   */
  #getUid = async () => {
    const uid1 = await this.#cascade(1);
    if (!Array.isArray(uid1)){
      return;
    }

    const sak1Req = [
      PICC_Cmd.SEL_CL1, 0x70, ...uid1
    ];
    const crc1 = await this.#calcCRC(sak1Req);
    if (!Array.isArray(crc1)){
      console.log('\x1b[1;35mCRC1 failed\x1b[0m');
      return;
    }
    const sak1 = await this.#transeive([...sak1Req, ...crc1]);
    if (!sak1.success){
      console.log('\x1b[1;35mSAK1 no success\x1b[0m');
      return;
    }
    if (!(sak1.data[0] & 0x04)){
      if (uid1[0] == 0x88){
        // error, indicates uid is longer
        return;
      }
      // UID 4 bytes
      return [...uid1.slice(0, 4)];
    }
    if (uid1[0] != 0x88){
      // error, not valid for next level
      return;
    }
    const uid2 = await this.#cascade(2);
    if (!Array.isArray(uid2)){
      return;
    }
    const sak2Req = [
      PICC_Cmd.SEL_CL2, 0x70, ...uid2
    ];
    const crc2 = await this.#calcCRC(sak2Req);
    if (!Array.isArray(crc2)){
      console.log('\x1b[1;35mCRC2 failed\x1b[0m');
      return;
    }
    const sak2 = await this.#transeive([...sak2Req, ...crc2]);
    if (!sak2.success){
      console.log('\x1b[1;35mSAK2 no success\x1b[0m');
      return;
    }
    if (!(sak2.data[0] & 0x04)){
      if (uid2[0] == 0x88){
        // error, indicates uid is longer
        return;
      }
      // UID 7 bytes
      return [...uid1.slice(1, 4), ...uid2.slice(0, 4)];
    }
    if (uid2[0] != 0x88){
      // error, not valid for next level
      return;
    }
    const uid3 = await this.#cascade(3);
    if (!Array.isArray(uid3)){
      return;
    }
    const sak3Req = [
      PICC_Cmd.SEL_CL3, 0x70, ...uid3
    ];
    const crc3 = await this.#calcCRC(sak3Req);
    if (!Array.isArray(crc3)){
      console.log('\x1b[1;35mCRC3 failed\x1b[0m');
      return;
    }
    const sak3 = await this.#transeive([...sak3Req, ...crc3]);
    if (!sak3.success){
      console.log('\x1b[1;35mSAK3 no success\x1b[0m');
      return;
    }
    // UID 10 bytes
    return [...uid1.slice(1, 4), ...uid2.slice(1, 4), ...uid3.slice(0, 4)];
  };

  /**
   * Set a callback on Tag detection, the uid is passed
   * @param {(uid:number[]) => void} callback
   * @returns {void}
   */
  onTag = (callback) => {
    this.#onTagCallback = callback;
  };

  /**
   * Notification of SPI clock
   * @param {(speedHz:number) => void} callback
   * @return {void}
   */
  onSpeed = (callback) => {
    this.#onSpeedCallback = callback;
  };

  /**
   * Notification that communication
   * with MFRC522 is up
   * @param {() => void} callback
   * @return {void}
   */
  onDeviceUp = (callback) => {
    this.#onDeviceUpCallback = callback;
  };

  /**
   * Notification that Communication
   * with the MFRC522 is down
   * @param {() => void} callback
   * @return {void}
   */
  onDeviceDown = (callback) => {
    this.#onDeviceDownCallback = callback;
  };

  /**
   * Set time before trying to attempt
   * raise the SPI clock
   * at least 10 minutes:
   * <attempt_cycles> * 50ms * 1200 before
   * speed attempts to go up.
   * At lower speeds the device will be busy, so
   * scan time will be a multiple of 50ms.
   */
  #setSpeedTimer = () => {
    this.#speedTimer = 1200;
  }

  /**
   * Checks if SPI communication with the
   * MFRC522 is ok by reading the version.
   * If not ok, the SPI clock is lowered
   * for 10 minutes.
   * @returns {Promise<boolean>}
   */
  #spiCheck = async () => {
    const [version] = await this.#read([PCD_Reg.Version]);
    const speedHz = this.#spi.getMaxSpeedHz();

    if ([0x90, 0x91, 0x92].includes(version)){
      // Ok, version reads fine

      // confirm device is up
      if (typeof this.#onDeviceUpCallback === 'function'){
        this.#onDeviceUpCallback();
      }
      // confirm SPI clock
      if (typeof this.#onSpeedCallback === 'function'){
        this.#onSpeedCallback(speedHz);
      }
      return true;
    }

    if (typeof this.#onDeviceDownCallback === 'function'){
      this.#onDeviceDownCallback();
    }

    if (speedHz < 200_000){
      // no change, already at lowest speed 125kHz
      return false;
    }

    const newSpeedHz = speedHz / 2;

    this.#spi.setMaxSpeedHz(newSpeedHz);

    if (typeof this.#onSpeedCallback === 'function'){
      this.#onSpeedCallback(newSpeedHz);
    }
    this.#setSpeedTimer();
    return false;
  }

  /**
   * Attempt to raise SPI clock speed.
   * @returns {void}
   */
  #spiSpeedUp = () => {
    const speedHz = this.#spi.getMaxSpeedHz();

    if (speedHz > 4_000_000){
      return;
    }

    const newSpeedHz = speedHz * 2;

    this.#spi.setMaxSpeedHz(newSpeedHz);

    if (typeof this.#onSpeedCallback === 'function'){
      this.#onSpeedCallback(newSpeedHz);
    }

    if (newSpeedHz > 4_000_000){
      return;
    }

    this.#setSpeedTimer();
  }

  /**
   * Scan continuously for tags.
   * @returns {Promise<void>}
   */
  scan = async () => {
    if (this.#scanStarted){
      return;
    }
    this.#scanStarted = true;

    await this.#reset();
    await this.#initRegs();

    // scan loop
    setInterval(async () => {
      if (this.#busy){
        console.log('\x1b[36m..reader busy, skip loop\x1b[0m');
        return;
      }
      this.#busy = true;

      try {
        if (this.#speedTimer){
          this.#speedTimer--;
          if (!this.#speedTimer){
            this.#spiSpeedUp();
          }
        }

        const check = await this.#spiCheck();

        if (!check){
          return;
        }

        await this.#write([[PCD_Reg.Command, PCD_Cmd.SoftReset]]);
        await this.#initRegs();

        const detected = await this.#detect();

        if (!detected){
          return;
        }

        const uid = await this.#getUid();

        if (Array.isArray(uid)){
          let uidStr = '';
          for(const b of uid){
            uidStr += b.toString(16).padStart(2, '0');
          }
          console.log(`Tag UID: \x1b[1;32m${uidStr}\x1b[0m`);
        } else {
          console.log(`Tag read \x1b[1;31m$Error\x1b[0m`);
        }

        if (uid && typeof this.#onTagCallback === 'function'){
          this.#onTagCallback(uid);
        }

      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        // antenna off
        await this.#clearBitMask(PCD_Reg.TxControl, 0x03);
        this.#busy = false;
      }
    }, 50);
  };
}

export { MFRC522Scan };
