// @ts-check
"use strict";

/**
 * based on https://github.com/miguelbalboa/rfid
 * MFRC522 commands. chapter 10
 * https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf
*/

const PCD_Cmd = {
  Idle: 0x00,		// no action, cancels current command execution
  Mem: 0x01,		// stores 25 bytes into the internal buffer
  GenerateRandomID: 0x02,		// generates a 10-byte random ID number
  CalcCRC: 0x03,		// activates the CRC coprocessor or performs a self-test
  Transmit: 0x04,		// transmits data from the FIFO buffer
  NoCmdChange: 0x07,		// no command change, can be used to modify the CommandReg register bits without affecting the command, for example, the PowerDown bit
  Receive: 0x08,		// activates the receiver circuits
  Transceive: 0x0C,		// transmits data from FIFO buffer to antenna and automatically activates the receiver after transmission
  MFAuthent: 0x0E,		// performs the MIFARE standard authentication as a reader
  SoftReset: 0x0F		// resets the MFRC522
};

export { PCD_Cmd };